import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  Timestamp, 
  runTransaction, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../../Data/firebase"; 
import "./AgendaMedico.css";

const AgendaMedico = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [viewMode, setViewMode] = useState("calendar"); 
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({
    patientName: "",
    appointmentType: "presencial",
    timeSlot: "09:00",
    status: "pendiente",
    notes: ""
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Horarios disponibles para citas
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",  
    "12:00", "12:30", "13:00", "15:00", "15:30", "16:00", "16:30"
  ];

  // Opciones de estado de citas con sus respectivos colores
  const statusOptions = {
    pendiente: { label: "Pendiente", color: "#f59e0b" },
    confirmada: { label: "Confirmada", color: "#10b981" },
    reprogramada: { label: "Reprogramada", color: "#3b82f6" },
    cancelada: { label: "Cancelada", color: "#ef4444" }
  };

  // Cargar citas desde Firestore al iniciar
  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const appointmentsRef = collection(db, "appointments");
        
        // Usar onSnapshot para mantener la información actualizada en tiempo real
        const unsubscribe = onSnapshot(appointmentsRef, (snapshot) => {
          const appointmentsData = snapshot.docs.map(doc => {
            const data = doc.data();
            // Asegurarse de que la fecha es un objeto Date válido
            let dateObject;
            if (data.date) {
              if (data.date.toDate) {
                // Es un Timestamp de Firestore
                dateObject = data.date.toDate();
              } else if (data.date instanceof Date) {
                // Ya es un objeto Date
                dateObject = data.date;
              } else {
                // Es otro formato (posiblemente string)
                dateObject = new Date(data.date);
              }
            } else {
              // Si no hay fecha, usar la fecha actual
              dateObject = new Date();
            }
            
            return {
              id: doc.id,
              ...data,
              date: dateObject
            };
          });
          
          setAppointments(appointmentsData);
          setLoading(false);
        }, (error) => {
          console.error("Error on Firestore snapshot:", error);
          setErrorMessage("Error al cargar las citas. Por favor recargue la página.");
          setLoading(false);
        });
        
        // Retornar la función de limpieza para desuscribirse cuando se desmonte el componente
        return () => unsubscribe();
      } catch (error) {
        console.error("Error loading appointments:", error);
        setErrorMessage("Error al cargar las citas. Por favor recargue la página.");
        setLoading(false);
      }
    };
    
    loadAppointments();
  }, []);

  // Función para obtener los datos del mes actual
  const getMonthData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { year, month, daysInMonth, startingDayOfWeek };
  };
  
  const monthData = getMonthData(currentDate);
  
  // Navegación entre meses
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
    setShowBookingForm(false);
  };
  
  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
    setShowBookingForm(false);
  };
  
  // Manejar clic en un día del calendario
  const handleDayClick = (day) => {
    const clickedDate = new Date(monthData.year, monthData.month, day);
    
    // Verificar si la fecha es pasada
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (clickedDate < today) {
      // Opcional: permitir ver citas pasadas pero no agregar nuevas
      setSelectedDate(clickedDate);
      setViewMode("details");
      setShowBookingForm(false);
      setIsEditing(false);
      setRescheduleMode(false);
      setSelectedAppointment(null);
      return;
    }
    
    setSelectedDate(clickedDate);
    setShowBookingForm(true);
    setViewMode("details");
    setIsEditing(false);
    setRescheduleMode(false);
    setSelectedAppointment(null);
    
    // Reiniciar el formulario
    setBookingDetails({
      patientName: "",
      appointmentType: "presencial",
      timeSlot: "09:00",
      status: "pendiente",
      notes: ""
    });
  };
  
  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
 
  // Volver a la vista de calendario
  const handleBackClick = () => {
    setViewMode("calendar");
    setShowBookingForm(false);
    setIsEditing(false);
    setRescheduleMode(false);
    setSelectedAppointment(null);
    setErrorMessage("");
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    setRescheduleMode(false);
    setSelectedAppointment(null);
    setErrorMessage("");
    
    // Reiniciar el formulario
    setBookingDetails({
      patientName: "",
      appointmentType: "presencial",
      timeSlot: "09:00",
      status: "pendiente",
      notes: ""
    });
  };

  // Reservar o actualizar cita
  const handleBookAppointment = async () => {
    // Validación básica
    if (!bookingDetails.patientName.trim()) {
      setErrorMessage("Por favor ingrese el nombre del paciente");
      return;
    }
    
    try {
      setErrorMessage("");
      
      // Verificar si existe una cita en el mismo horario (solo para nuevas citas o cambio de horario)
      if (!isEditing || (isEditing && selectedAppointment?.timeSlot !== bookingDetails.timeSlot)) {
        const existingAppointment = appointments.find(
          app => 
            app.date.getDate() === selectedDate.getDate() &&
            app.date.getMonth() === selectedDate.getMonth() &&
            app.date.getFullYear() === selectedDate.getFullYear() &&
            app.timeSlot === bookingDetails.timeSlot &&
            app.status !== "cancelada" &&
            (!selectedAppointment || app.id !== selectedAppointment.id)
        );
    
        if (existingAppointment) {
          setErrorMessage("Ya existe una cita programada para este horario. Por favor seleccione otro horario.");
          return;
        }
      }
      
      // Si estamos editando una cita existente
      if (isEditing && selectedAppointment) {
        const appointmentRef = doc(db, "appointments", selectedAppointment.id);
        
        if (rescheduleMode) {
          // En modo reprogramación
          await runTransaction(db, async (transaction) => {
            // Actualizar la cita en appointments
            transaction.update(appointmentRef, {
              timeSlot: bookingDetails.timeSlot,
              appointmentType: bookingDetails.appointmentType,
              status: "reprogramada",
              lastUpdated: serverTimestamp(),
              notes: bookingDetails.notes || selectedAppointment.notes || ""
            });
    
            // Si existe referencia a agentdaturno, actualizarlo también
            if (selectedAppointment.agentdaturnoId) {
              const agentdaturnoRef = doc(db, "agentdaturno", selectedAppointment.agentdaturnoId);
              transaction.update(agentdaturnoRef, {
                hora: bookingDetails.timeSlot,
                tipoconsulta: bookingDetails.appointmentType,
                estado: "reprogramado",
                updatedAt: serverTimestamp(),
                notas: bookingDetails.notes || selectedAppointment.notes || ""
              });
            }
          });
    
          alert("Cita reprogramada con éxito");
        } else {
          // En modo edición normal
          await runTransaction(db, async (transaction) => {
            // Actualizar la cita en appointments
            transaction.update(appointmentRef, {
              patientName: bookingDetails.patientName,
              appointmentType: bookingDetails.appointmentType,
              timeSlot: bookingDetails.timeSlot,
              status: bookingDetails.status,
              lastUpdated: serverTimestamp(),
              notes: bookingDetails.notes || ""
            });
    
            // Si existe referencia a agentdaturno, actualizarlo también
            if (selectedAppointment.agentdaturnoId) {
              const agentdaturnoRef = doc(db, "agentdaturno", selectedAppointment.agentdaturnoId);
              transaction.update(agentdaturnoRef, {
                pacienteNombre: bookingDetails.patientName,
                tipoconsulta: bookingDetails.appointmentType,
                hora: bookingDetails.timeSlot,
                estado: convertirEstadoParaAgentdaturno(bookingDetails.status),
                updatedAt: serverTimestamp(),
                notas: bookingDetails.notes || ""
              });
            }
          });
    
          alert("Cita actualizada con éxito");
        }
      } else {
        // Crear nueva cita
        try {
          // Preparar la fecha correcta con la hora seleccionada
          const [hours, minutes] = bookingDetails.timeSlot.split(':').map(num => parseInt(num, 10));
          const appointmentDate = new Date(selectedDate);
          appointmentDate.setHours(hours, minutes, 0, 0);
          
          // Crear nueva cita en appointments
          const newAppointmentRef = await addDoc(collection(db, "appointments"), {
            date: appointmentDate,
            patientName: bookingDetails.patientName.trim(),
            appointmentType: bookingDetails.appointmentType,
            timeSlot: bookingDetails.timeSlot,
            status: "pendiente",
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            notes: bookingDetails.notes || ""
          });
    
          // Crear el documento correspondiente en agentdaturno
          const agentdaturnoRef = await addDoc(collection(db, "agentdaturno"), {
            pacienteId: "", // Aquí deberías incluir el ID del paciente si está disponible
            pacienteNombre: bookingDetails.patientName.trim(),
            especialidad: "", // Especialidad del médico (si se conoce)
            medico: "", // Nombre del médico (si se conoce)
            fecha: appointmentDate,
            hora: bookingDetails.timeSlot,
            tipoconsulta: bookingDetails.appointmentType,
            estado: "pendiente",
            appointmentId: newAppointmentRef.id, // Referencia a la cita
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            notas: bookingDetails.notes || ""
          });
          
          // Actualizar la cita con la referencia al agentdaturno
          await updateDoc(newAppointmentRef, {
            agentdaturnoId: agentdaturnoRef.id
          });
    
          alert("Consulta programada con éxito");
        } catch (error) {
          console.error("Error creating appointment:", error);
          throw error; // Re-lanzar para el catch externo
        }
      }
    
      // Reiniciar el formulario después de guardar
      setBookingDetails({
        patientName: "",
        appointmentType: "presencial",
        timeSlot: "09:00",
        status: "pendiente",
        notes: ""
      });
      
      setIsEditing(false);
      setRescheduleMode(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error saving appointment:", error);
      setErrorMessage("Ocurrió un error al guardar la cita. Por favor intente de nuevo.");
    }
  };

  // Función para convertir estados entre sistemas
  const convertirEstadoParaAgentdaturno = (estadoAppointment) => {
    const mapeoEstados = {
      "pendiente": "pendiente",
      "confirmada": "confirmado",
      "reprogramada": "reprogramado",
      "cancelada": "cancelado"
    };
    
    return mapeoEstados[estadoAppointment] || "pendiente";
  };
 
  // Manejar acciones sobre citas (confirmar, cancelar, etc.)
  const handleAppointmentAction = async (appointment, action) => {
    if (!appointment || !appointment.id) {
      setErrorMessage("La cita no está definida correctamente");
      return;
    }
    
    try {
      setErrorMessage("");
      const appointmentRef = doc(db, "appointments", appointment.id);
      
      if (action === "confirmar") {
        await runTransaction(db, async (transaction) => {
          // Actualizar el estado en appointments
          transaction.update(appointmentRef, {
            status: "confirmada",
            lastUpdated: serverTimestamp()
          });
    
          // Si existe referencia a agentdaturno, actualizarlo también
          if (appointment.agentdaturnoId) {
            const agentdaturnoRef = doc(db, "agentdaturno", appointment.agentdaturnoId);
            transaction.update(agentdaturnoRef, {
              estado: "confirmado",
              updatedAt: serverTimestamp()
            });
          }
        });
    
        alert("Cita confirmada exitosamente");
      }
      else if (action === "cancelar") {
        if (!window.confirm("¿Está seguro que desea cancelar esta cita?")) {
          return;
        }
    
        await runTransaction(db, async (transaction) => {
          // Actualizar la cita en appointments
          transaction.update(appointmentRef, {
            status: "cancelada",
            lastUpdated: serverTimestamp()
          });
    
          // Si existe referencia a agentdaturno, actualizarlo también
          if (appointment.agentdaturnoId) {
            const agentdaturnoRef = doc(db, "agentdaturno", appointment.agentdaturnoId);
            transaction.update(agentdaturnoRef, {
              estado: "cancelado",
              updatedAt: serverTimestamp()
            });
          }
        });
    
        alert("Cita cancelada exitosamente");
      }
      else if (action === "reprogramar") {
        setIsEditing(true);
        setRescheduleMode(true);
        setSelectedAppointment(appointment);
        setBookingDetails({
          patientName: appointment.patientName || "",
          appointmentType: appointment.appointmentType || "presencial",
          timeSlot: appointment.timeSlot || "09:00",
          status: appointment.status || "pendiente",
          notes: appointment.notes || ""
        });
      }
      else if (action === "editar") {
        setIsEditing(true);
        setRescheduleMode(false);
        setSelectedAppointment(appointment);
        setBookingDetails({
          patientName: appointment.patientName || "",
          appointmentType: appointment.appointmentType || "presencial",
          timeSlot: appointment.timeSlot || "09:00",
          status: appointment.status || "pendiente",
          notes: appointment.notes || ""
        });
      }
    } catch (error) {
      console.error("Error al procesar la acción de cita:", error);
      setErrorMessage(`Ocurrió un error: ${error.message}`);
    }
  };
  
  // Obtener citas para un día específico
  const getAppointmentsForDay = (day) => {
    const date = new Date(monthData.year, monthData.month, day);
    return appointments.filter(appointment => {
      if (!appointment.date) return false;
      
      return (
        appointment.date.getDate() === date.getDate() &&
        appointment.date.getMonth() === date.getMonth() &&
        appointment.date.getFullYear() === date.getFullYear()
      );
    });
  };

  // Obtener cuenta de citas activas para un día (excluyendo canceladas)
  const getActiveAppointmentsCountForDay = (day) => {
    return getAppointmentsForDay(day).filter(app => app.status !== "cancelada").length;
  };
  
  // Crear grid del calendario
  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Añadir celdas vacías para los días anteriores al primer día del mes
    for (let i = 0; i < monthData.startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Añadir los días del mes
    for (let day = 1; day <= monthData.daysInMonth; day++) {
      const date = new Date(monthData.year, monthData.month, day);
      date.setHours(0, 0, 0, 0);
      
      const isToday = today.getDate() === day && 
                     today.getMonth() === monthData.month && 
                     today.getFullYear() === monthData.year;
                     
      const isSelected = selectedDate && 
                       selectedDate.getDate() === day && 
                       selectedDate.getMonth() === monthData.month && 
                       selectedDate.getFullYear() === monthData.year;
                       
      const isPast = date < today;
      
      const dayAppointments = getAppointmentsForDay(day);
      const activeAppointmentsCount = getActiveAppointmentsCountForDay(day);
      const hasAppointments = activeAppointmentsCount > 0;
      
      // Verificar si hay citas pendientes para este día
      const hasPendingAppointments = dayAppointments.some(app => app.status === "pendiente");
      
      days.push(
        <div 
          key={day} 
          onClick={() => handleDayClick(day)}
          className={`calendar-day-wrapper ${isPast ? 'past-day' : ''}`}
        >
          <div 
            className={`calendar-day ${isToday ? 'day-today' : ''} ${isSelected ? 'day-selected' : ''} ${isPast ? 'day-disabled' : ''}`}
          >
            {day}
          </div>
          {hasAppointments && (
            <div className={`appointment-indicator-container ${hasPendingAppointments ? 'has-pending' : ''}`}>
              <div className="appointment-count">
                {activeAppointmentsCount}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };
  
  // Formatear fecha como string
  const formatDate = (date) => {
    if (!date) return "";
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };
  
  // Formatear hora para mostrar
  const formatTime = (timeSlot) => {
    return timeSlot;
  };
  
  // Obtener citas para la fecha seleccionada (ordenadas por hora)
  const selectedDateAppointments = selectedDate 
    ? appointments
        .filter(appointment => {
          if (!appointment.date) return false;
          
          return (
            appointment.date.getDate() === selectedDate.getDate() &&
            appointment.date.getMonth() === selectedDate.getMonth() &&
            appointment.date.getFullYear() === selectedDate.getFullYear()
          );
        })
        .sort((a, b) => {
          // Ordenar por hora
          return a.timeSlot.localeCompare(b.timeSlot);
        })
    : [];
  
  // Nombres de meses en español
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  
  // Días de la semana en español (comenzando el domingo)
  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Verificar si una fecha es pasada
  const isPastDate = (date) => {
    if (!date) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    
    return compareDate < today;
  };
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h2>Calendario de Consultas</h2>
        </div>
        
        {viewMode === "details" && (
          <button onClick={handleBackClick} className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Volver al Calendario
          </button>
        )}
      </div>
      
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Cargando citas...</p>
        </div>
      )}
      
      {!loading && viewMode === "calendar" && (
        <div className="calendar-grid">
          {/* Calendar Column */}
          <div className="calendar-column">
            {/* Month Navigation */}
            <div className="month-header">
              <button 
                onClick={handlePrevMonth}
                className="month-nav-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              
              <h3 className="month-name">
                {monthNames[monthData.month]} {monthData.year}
              </h3>
              
              <button 
                onClick={handleNextMonth}
                className="month-nav-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
            
            {/* Calendar Grid */}
            <div className="calendar-body">
              {/* Days of week */}
              <div className="weekdays-grid">
                {weekDays.map(day => (
                  <div key={day} className="weekday">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="days-grid">
                {renderCalendarDays()}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="calendar-legend">
            <h3 className="legend-title">Leyenda</h3>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-indicator today"></div>
                <span>Hoy</span>
              </div>
              <div className="legend-item">
                <div className="legend-indicator appointment"></div>
                <span>Citas Programadas</span>
              </div>
              <div className="legend-item">
                <div className="legend-indicator pending"></div>
                <span>Citas Pendientes</span>
              </div>
              <div className="legend-item">
                <div className="legend-indicator past"></div>
                <span>Días Pasados</span>
              </div>
            </div>
            
            <div className="legend-status">
              <h4>Estados de Cita</h4>
              <div className="status-items">
                {Object.entries(statusOptions).map(([key, { label, color }]) => (
                  <div key={key} className="status-item">
                    <div className="status-indicator" style={{ backgroundColor: color }}></div>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="legend-instructions">
              <h4>Instrucciones</h4>
              <p>
                Haga clic en cualquier día del calendario para ver las citas programadas o programar una nueva consulta.
              </p>
              <p>
                El número en los días indica la cantidad de citas activas para ese día.
              </p>
              <p>
                Para gestionar una cita, haga clic en las opciones disponibles en cada tarjeta de cita.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {!loading && viewMode === "details" && (
        <div className="detail-view">
          <div className="selected-date-header">
            <h3>{formatDate(selectedDate)}</h3>
          </div>
          
          <div className="detail-content">
            {/* Existing appointments */}
            <div className="existing-appointments">
              <h4 className="section-title">Citas Programadas</h4>
              
              {selectedDateAppointments.length > 0 ? (
                <div className="appointments-list">
                  {selectedDateAppointments.map(appointment => (
                    <div 
                      key={appointment.id} 
                      className={`appointment-card ${appointment.status === "cancelada" ? 'appointment-cancelled' : ''}`}
                    >
                      <div className="appointment-time">
                        {formatTime(appointment.timeSlot)}
                      </div>
                      <div className="appointment-details">
                        <div className="patient-name">{appointment.patientName}</div>
                        <div className="appointment-info">
                          <div className="appointment-type">
                            {appointment.appointmentType === "virtual" ? (
                              <span className="type-tag virtual">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                </svg>
                                Virtual
                              </span>
                            ) : (
                              <span className="type-tag presencial">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="9" cy="7" r="4"></circle>
                                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                Presencial
                              </span>
                            )}
                          </div>
                          <div 
                            className="appointment-status"
                            style={{
                              backgroundColor: statusOptions[appointment.status]?.color || '#999',
                              color: '#fff'
                            }}
                          >
                            {statusOptions[appointment.status]?.label || 'Pendiente'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Acciones para el médico */}
                      {appointment.status !== "cancelada" && (
                        <div className="appointment-actions">
                          {appointment.status === "pendiente" && (
                            <button 
                              onClick={() => handleAppointmentAction(appointment, "confirmar")}
                              className="action-button confirm"
                              title="Confirmar cita"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </button>
                          )}
                          
                          <button 
                            onClick={() => handleAppointmentAction(appointment, "reprogramar")}
                            className="action-button reschedule"
                            title="Reprogramar cita"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                          </button>
                          
                          <button 
                            onClick={() => handleAppointmentAction(appointment, "editar")}
                            className="action-button edit"
                            title="Editar cita"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          
                          <button 
                            onClick={() => handleAppointmentAction(appointment, "cancelar")}
                            className="action-button cancel"
                            title="Cancelar cita"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="15" y1="9" x2="9" y2="15"></line>
                              <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-appointments">No hay citas programadas para este día</p>
              )}
            </div>
            
            {/* Booking form */}
            {!isEditing ? (
              <div className="booking-container visible">
                <div className="booking-form">
                  <h3 className="booking-title">
                    Programar nueva consulta
                  </h3>
                  
                  <form>
                    {/* Patient Name */}
                    <div className="form-group">
                      <label className="form-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Nombre del Paciente
                      </label>
                      <input
                        type="text"
                        name="patientName"
                        value={bookingDetails.patientName}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Ingrese nombre completo"
                        required
                      />
                    </div>
                    
                    {/* Appointment Type */}
                    <div className="form-group">
                      <label className="form-label">Modalidad de Consulta</label>
                      <div className="radio-group">
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="appointmentType"
                            value="virtual"
                            checked={bookingDetails.appointmentType === "virtual"}
                            onChange={handleInputChange}
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="23 7 16 12 23 17 23 7"></polygon>
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                          </svg>
                          Virtual
                        </label>
                        
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="appointmentType"
                            value="presencial"
                            checked={bookingDetails.appointmentType === "presencial"}
                            onChange={handleInputChange}
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          Presencial
                        </label>
                      </div>
                    </div>
                    
                    {/* Time Selection */}
                    <div className="form-group">
                      <label className="form-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Horario
                      </label>
                      <select
                        name="timeSlot"
                        value={bookingDetails.timeSlot}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        {timeSlots.map(time => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Submit Button */}
                    <button
                      type="button"
                      onClick={handleBookAppointment}
                      className="submit-button"
                    >
                      Programar Consulta
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="booking-container visible">
                <div className="booking-form">
                  <h3 className="booking-title">
                    {rescheduleMode 
                      ? "Reprogramar Consulta" 
                      : "Editar Consulta"}
                  </h3>
                  
                  <form>
                    {/* Patient Name - solo visible si no estamos reprogramando */}
                    {!rescheduleMode && (
                      <div className="form-group">
                        <label className="form-label">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          Nombre del Paciente
                        </label>
                        <input
                          type="text"
                          name="patientName"
                          value={bookingDetails.patientName}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Ingrese nombre completo"
                          required
                        />
                      </div>
                    )}
                    
                    {/* Appointment Type */}
                    <div className="form-group">
                      <label className="form-label">Modalidad de Consulta</label>
                      <div className="radio-group">
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="appointmentType"
                            value="virtual"
                            checked={bookingDetails.appointmentType === "virtual"}
                            onChange={handleInputChange}
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="23 7 16 12 23 17 23 7"></polygon>
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                          </svg>
                          Virtual
                        </label>
                        
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="appointmentType"
                            value="presencial"
                            checked={bookingDetails.appointmentType === "presencial"}
                            onChange={handleInputChange}
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          Presencial
                        </label>
                      </div>
                    </div>
                    
                    {/* Time Selection */}
                    <div className="form-group">
                      <label className="form-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Horario
                      </label>
                      <select
                        name="timeSlot"
                        value={bookingDetails.timeSlot}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        {timeSlots.map(time => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Status Selection - solo visible si no estamos reprogramando */}
                    {!rescheduleMode && (
                      <div className="form-group">
                        <label className="form-label">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          Estado de la Cita
                        </label>
                        <select
                          name="status"
                          value={bookingDetails.status}
                          onChange={handleInputChange}
                          className="form-select"
                        >
                          {Object.entries(statusOptions).map(([key, { label }]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="cancel-button"
                      >
                        Cancelar
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleBookAppointment}
                        className="submit-button"
                      >
                        {rescheduleMode ? "Reprogramar" : "Guardar Cambios"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaMedico;