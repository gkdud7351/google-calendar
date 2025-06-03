import {  useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useRef, useEffect, useState } from 'react';
import { addEvent, deleteEvent } from '../features/calendar/calendarSlice';
import { EventClickArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import koLocale from '@fullcalendar/core/locales/ko';
import Modal from "../components/modal/Modal"
import './WeekCalendar.scss'

const WeekCalendar = () => {
  const dispatch = useDispatch();
  const calendarRef = useRef<FullCalendar | null>(null);
  const selectedDate = useSelector((state: RootState) => state.calendar.selectedDate);
  const events = useSelector((state: RootState) => state.calendar.events);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);

  const handleDateClick = (arg: { date: Date }) => {
    setSelectedStart(arg.date);
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const title = clickInfo.event.title;
    const id = clickInfo.event.id;

    if (window.confirm(`'${title}' 일정을 삭제할까요?`)) {
      dispatch(deleteEvent(id));
    }
  };

  const handleConfirm = (title: string, start: Date, end: Date) => {
    if (!selectedStart || !title) return;

    dispatch(
      addEvent({
        id: String(Date.now()),
        title,
        start,
        end,
        allDay: false
      })
    );
    setModalOpen(false);
    setSelectedStart(null);
  };

  // selectedDate가 바뀌면 캘린더 이동
  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.gotoDate(selectedDate);
    }
  }, [selectedDate]);

  return (
    <>
      <FullCalendar
        locale={koLocale}
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        events={events}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        initialView="timeGridWeek"
        initialDate={selectedDate}
        headerToolbar={false}
      />

      {modalOpen && selectedStart && (
        <Modal
          start={selectedStart}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default WeekCalendar;
