import { EventInput } from "@fullcalendar/core";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CalendarState {
  selectedDate : Date;
  pageMode : 'weekly' | 'monthly'
  events : EventInput[];
}

const initialState : CalendarState = {
  selectedDate: new Date(),
  pageMode:'weekly',
  events:[],
};

const calendarSlice = createSlice({
  name:'calendar',
  initialState,
  reducers: {
    setSelectedDate(state, action: PayloadAction<Date>) {
      state.selectedDate = action.payload;
    },
    moveWeek(state, action:PayloadAction<'prev'|'next'>) {
      const delta = action.payload === 'prev' ? -7 : 7
      const current = new Date(state.selectedDate)
      current.setDate(current.getDate() + delta)  //setDate()는 기존 날짜 객체의 일만 변경하면서 월/연도도 자동으로 보정해줌
      state.selectedDate = current
    },
    moveMonth(state, action:PayloadAction<'prev'|'next'>) {
      const current = new Date(state.selectedDate);
      const delta = action.payload === 'prev' ? -1 : 1;
      const newDate = new Date(current.getFullYear(), current.getMonth() + delta, 1);
      state.selectedDate = newDate;
    },
    setPageMode(state, action:PayloadAction<'weekly'|'monthly'>) {
      state.pageMode = action.payload
    },
    addEvent(state, action:PayloadAction<EventInput>) {
      state.events.push(action.payload)
    },
    deleteEvent(state, action:PayloadAction<string>) {
      state.events = state.events.filter((e)=>e.id !== action.payload)
    }
  }
})

export const { setSelectedDate, moveWeek, moveMonth, setPageMode, addEvent, deleteEvent } = calendarSlice.actions;
export default calendarSlice.reducer;