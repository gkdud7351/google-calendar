import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useRef, useEffect, useState } from "react";
import {
  addEvent,
  deleteEvent,
  updateEvent,
} from "../features/calendar/calendarSlice";
import { EventClickArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import koLocale from "@fullcalendar/core/locales/ko";
import Modal from "../components/modal/Modal";
import InfoModal from "../components/modal/InfoModal";
import "./WeekCalendar.scss";
import EditModal from "../components/modal/EditModal";

const WeekCalendar = () => {
  const dispatch = useDispatch();
  const calendarRef = useRef<FullCalendar | null>(null);
  const selectedDate = useSelector(
    (state: RootState) => state.calendar.selectedDate
  );
  const events = useSelector((state: RootState) => state.calendar.events);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"info" | "edit" | null>(null);
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<{
    id: string;
    title: string;
    start: Date;
    end: Date;
  } | null>(null);
  const [modalPosition, setModalPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedStart(arg.date);
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const rect = clickInfo.el.getBoundingClientRect();

    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start!,
      end: clickInfo.event.end!,
    });

    setModalPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
    });
    setModalMode("info");
  };

  const handleConfirm = (title: string, start: Date, end: Date) => {
    dispatch(
      addEvent({
        id: String(Date.now()),
        title,
        start,
        end,
        allDay: false,
      })
    );

    setModalOpen(false);
    setSelectedStart(null);
  };
  const handleEdit = (id: string, title: string, start: Date, end: Date) => {
    dispatch(
      updateEvent({
        id,
        title,
        start,
        end,
        allDay: false,
      })
    );
    setModalMode(null);
    setSelectedEvent(null);
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
        height="auto"
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

      {modalMode === "info" && selectedEvent && modalPosition && (
        <InfoModal
          event={selectedEvent}
          onClose={() => setModalMode(null)}
          onEdit={() => setModalMode("edit")}
          onDelete={(id) => {
            dispatch(deleteEvent(id));
            setModalMode(null);
          }}
          style={{
            position: "absolute",
            top: modalPosition.y - 10,
            left: modalPosition.x - 10,
            transform: "translateX(-100%)",
            zIndex: 9999,
          }}
        />
      )}

      {modalMode === "edit" && selectedEvent && modalPosition && (
        <EditModal
          event={selectedEvent}
          onClose={() => setModalMode(null)}
          onConfirm={(updatedEvent) =>
            handleEdit(
              updatedEvent.id,
              updatedEvent.title,
              updatedEvent.start,
              updatedEvent.end
            )
          }
          style={{
            position: "absolute",
            top: modalPosition.y - 10,
            left: modalPosition.x - 10,
            transform: "translateX(-100%)",
            zIndex: 9999,
          }}
        />
      )}
    </>
  );
};

export default WeekCalendar;
