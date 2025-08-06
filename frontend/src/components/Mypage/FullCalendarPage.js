import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';
import '../../css/FullCalendarPage.css';
import Camodal from './Camodal';
import axios from "../../axios";
import Upmodal from './Upmodal';

const FullCalendarPage = ({ mem_id }) => {
  const [showModal, setShowModal] = useState(false);
  const [showeModal, setShoweModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [infoTitle, setInfoTitle] = useState('');
  const [infoLocation, setInfoLocation] = useState('');
  const [endDate, setEndDate] = useState('');
  const [events, setEvents] = useState([]);
  const [calIdx, setCalIdx] = useState('');
  const [weatherData, setWeatherData] = useState([]);

  const key = 'a9f2686d2edb739fcbb28be70d6e4cfe';

  useEffect(() => {
    fetchEvents();
    fetchWeatherData();
  }, [showModal, showeModal, calIdx]);

  const fetchEvents = () => {
    axios.get(`/Calender/${mem_id}`)
      .then((res) => {
        const formattedEvents = res.data.calendar.map(event => ({
          title: event.cal_title,
          start: combineDateTime(event.cal_st_dt, event.cal_st_tm),
          end: combineDateTime(event.cal_ed_dt, event.cal_ed_tm),
          location: event.cal_loc,
          color: event.cal_color,
          cal_idx: event.cal_idx
        }));
        setEvents(formattedEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  };

  const fetchWeatherData = async () => {
    try {
      const lat = 35.1595;
      const lon = 126.8526;

      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=kr`);
      const data = await response.json();
      const dailyForecasts = data.list.filter(item => item.dt_txt.endsWith('18:00:00')).map(item => ({
        ...item,
        dt_txt: new Date(new Date(item.dt_txt).toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
      }));
      setWeatherData(dailyForecasts);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const combineDateTime = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    const time = timeStr.split(':');
    date.setHours(Number(time[0]));
    date.setMinutes(Number(time[1]));
    return date;
  };

  const dateClick = (info) => {
    setSelectedDate(info.dateStr);
    setShowModal(true);
  };

  const handleCloseModal = (newEvent) => {
    setShowModal(false);
    setShoweModal(false);
    if (newEvent) {
      setEvents(prevEvents => [...prevEvents, newEvent]);
    }
  };

  const eventClick = (info) => {
    const eventStart = info.event.start;
    const eventEnd = info.event.end;
    const eventTitle = info.event.title;
    const eventLocation = info.event.extendedProps.location;
    const calIdx = info.event.extendedProps.cal_idx;

    Swal.fire({
      title: '일정',
      html:
        `<div style="text-align: center; background-color: #f0f0f0; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <div style="text-align: left; padding-left: 16px;">
            <div style="margin-bottom: 12px;">
              <strong style="display: inline-block; width: 100px; font-weight: bold; color: #3085d6;">일정 내용:</strong> ${eventTitle}
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="display: inline-block; width: 100px; font-weight: bold; color: #3085d6; padding-left:40px;">장소:</strong> ${eventLocation}
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="display: inline-block; width: 100px; font-weight: bold; color: #3085d6;  padding-left:40px; ">시작:</strong> ${eventStart.toLocaleString()}
            </div>
            <div>
              <strong style="display: inline-block; width: 100px; font-weight: bold; color: #3085d6;  padding-left:40px;">종료:</strong> ${eventEnd.toLocaleString()}
            </div>
          </div>
        </div>`,
      icon: 'info',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '수정',
      cancelButtonText: '취소',
      denyButtonText: '삭제',
      reverseButtons: false,
    }).then(result => {
      if (result.isConfirmed) {
        setShoweModal(true);
        setStartDate(eventStart);
        setEndDate(eventEnd);
        setInfoTitle(eventTitle);
        setInfoLocation(eventLocation);
        setCalIdx(calIdx);
      } else if (result.isDenied) {
        deleteEvent(calIdx);
      }
    });
  };

  const deleteEvent = (calIdx) => {
    axios.delete(`/Calender/Delete/${calIdx}`)
      .then(response => {
        console.log(response.data);
        setEvents(events.filter(event => event.cal_idx !== calIdx));
        Swal.fire('삭제되었습니다.', '화끈하시네요~!', 'success');
      })
      .catch(error => {
        console.error('삭제 실패:', error);
        Swal.fire('삭제 실패', '문제가 발생하여 삭제하지 못했습니다.', 'error');
      });
  };

  const renderWeatherEvent = (date) => {
    const weather = weatherData.find(item => {
      const weatherDate = item.dt_txt.toISOString().split('T')[0];
      return weatherDate === date;
    });
    if (!weather) return null;

    return (
      <div>
        <img
         /* 날씨 이미지와 설명을 렌더링하는 부분입니다 */
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          style={{ width: '30px', height: '30px' }}
        />
        <p>{weather.weather[0].description}</p>
      </div>
    );
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,today,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        buttonText={{
          month: '월',
          week: '주',
          today: '오늘'
        }}
        initialView="dayGridMonth"
        nowIndicator={true}
        locale="ko"
        events={events}
        timeZone="Asia/Seoul"
        dateClick={dateClick}
        eventClick={eventClick}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: false
        }}
        dayCellContent={(args) => {
          const date = args.date.toISOString().split('T')[0];
          return (
            <>
              <div>{args.dayNumberText}</div>
              {renderWeatherEvent(date)}
            </>
          );
        }}
      />

      <Camodal
        show={showModal}
        handleClose={handleCloseModal}
        date={selectedDate}
        mem_id={mem_id}
      />

      <Upmodal
        show={showeModal}
        handleClose={handleCloseModal}
        start={startDate}
        end={endDate}
        mem_id={mem_id}
        titles={infoTitle}
        locations={infoLocation}
        cal_Idx={calIdx}
      />
    </>
  );
};

export default FullCalendarPage;
