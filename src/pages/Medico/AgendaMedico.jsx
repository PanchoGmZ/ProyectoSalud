import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AgendaMedico.css"; // Importa tu CSS aquí

const AgendaMedico = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [viewMode, setViewMode] = useState("calendar"); // calendar or details
  const [bookingDetails, setBookingDetails] = useState({
    patientName: "",
    appointmentType: "presencial",
    timeSlot: "09:00"
  });
  
  // Fictional appointments data
  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2), 
      patientName: "Carlos Martínez", 
      appointmentType: "presencial", 
      timeSlot: "09:30" 
    },
    { 
      id: 2, 
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2), 
      patientName: "María González", 
      appointmentType: "virtual", 
      timeSlot: "11:00" 
    },
    { 
      id: 3, 
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 4), 
      patientName: "Luisa Hernández", 
      appointmentType: "presencial", 
      timeSlot: "15:30" 
    },
    { 
      id: 4, 
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7), 
      patientName: "Roberto Sánchez", 
      appointmentType: "virtual", 
      timeSlot: "10:00" 
    },
    { 
      id: 5, 
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7), 
      patientName: "Ana Rodríguez", 
      appointmentType: "presencial", 
      timeSlot: "12:30" 
    },
    { 
      id: 6, 
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 15), 
      patientName: "Javier López", 
      appointmentType: "presencial", 
      timeSlot: "16:00" 
    }
  ]);
  
  // Available time slots
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",  
    "12:00", "12:30", "13:00", "15:00", "15:30", "16:00", "16:30"
  ];
  
  // Get month details
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
  
  // Handle month navigation
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
  
  // Handle day selection
  const handleDayClick = (day) => {
    const clickedDate = new Date(monthData.year, monthData.month, day);
    setSelectedDate(clickedDate);
    setShowBookingForm(true);
    setViewMode("details");
  };
  
  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle back button click
  const handleBackClick = () => {
    setViewMode("calendar");
    setShowBookingForm(false);
  };
  const handleRegresar1 = () => {
    navigate(-1);
  };

  // Handle booking submission
  const handleBookAppointment = () => {
    // Create a new appointment
    const newAppointment = {
      id: appointments.length + 1,
      date: selectedDate,
      patientName: bookingDetails.patientName,
      appointmentType: bookingDetails.appointmentType,
      timeSlot: bookingDetails.timeSlot
    };
    
    // Add to appointments array
    setAppointments([...appointments, newAppointment]);
    
    // Reset form
    setBookingDetails({
      patientName: "",
      appointmentType: "presencial",
      timeSlot: "09:00"
    });
    
    // Show success message
    alert("Consulta programada con éxito");
    
    // Return to calendar view
    setViewMode("calendar");
    setShowBookingForm(false);
  };
  
  // Get appointments for a specific day
  const getAppointmentsForDay = (day) => {
    const date = new Date(monthData.year, monthData.month, day);
    return appointments.filter(appointment => 
      appointment.date.getDate() === date.getDate() &&
      appointment.date.getMonth() === date.getMonth() &&
      appointment.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Create calendar grid
  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < monthData.startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= monthData.daysInMonth; day++) {
      const date = new Date(monthData.year, monthData.month, day);
      const isToday = today.getDate() === day && 
                      today.getMonth() === monthData.month && 
                      today.getFullYear() === monthData.year;
      const isSelected = selectedDate && 
                        selectedDate.getDate() === day && 
                        selectedDate.getMonth() === monthData.month && 
                        selectedDate.getFullYear() === monthData.year;
      const isPast = date < new Date(today.setHours(0,0,0,0));
      
      const dayAppointments = getAppointmentsForDay(day);
      const hasAppointments = dayAppointments.length > 0;
      
      days.push(
        <div 
          key={day} 
          onClick={() => !isPast && handleDayClick(day)}
          className={`calendar-day-wrapper ${isPast ? 'past-day' : ''}`}
        >
          <div 
            className={`calendar-day ${isToday ? 'day-today' : ''} ${isSelected ? 'day-selected' : ''} ${isPast ? 'day-disabled' : ''}`}
          >
            {day}
          </div>
          {hasAppointments && (
            <div className="appointment-indicator-container">
              <div className="appointment-count">
                {dayAppointments.length}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };
  
  // Format date as string
  const formatDate = (date) => {
    if (!date) return "";
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };
  
  // Format time for display
  const formatTime = (timeSlot) => {
    return timeSlot;
  };
  
  // Get appointments for selected date
  const selectedDateAppointments = selectedDate 
    ? appointments.filter(appointment => 
        appointment.date.getDate() === selectedDate.getDate() &&
        appointment.date.getMonth() === selectedDate.getMonth() &&
        appointment.date.getFullYear() === selectedDate.getFullYear()
      )
    : [];
  
  // Month names in Spanish
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  
  // Days of week in Spanish (starting on Sunday)
  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

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
      
      {viewMode === "calendar" && (
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
                <div className="legend-indicator past"></div>
                <span>Días Pasados</span>
              </div>
            </div>
            
            <div className="legend-instructions">
              <h4>Instrucciones</h4>
              <p>
                Haga clic en cualquier día del calendario para ver las citas programadas o programar una nueva consulta.
              </p>
              <p>
                El número en los días indica la cantidad de citas programadas para ese día.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {viewMode === "details" && (
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
                    <div key={appointment.id} className="appointment-card">
                      <div className="appointment-time">
                        {formatTime(appointment.timeSlot)}
                      </div>
                      <div className="appointment-details">
                        <div className="patient-name">{appointment.patientName}</div>
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
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-appointments">No hay citas programadas para este día</p>
              )}
            </div>
            
            {/* Booking form */}
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
          </div>
        </div>
      )}
    </div>
   
  );
};

export default AgendaMedico;