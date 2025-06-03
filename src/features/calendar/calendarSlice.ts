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
      const newDate = new Date(state.selectedDate)
      newDate.setDate(newDate.getDate() + delta)
      state.selectedDate = newDate
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

export const { setSelectedDate, moveWeek, setPageMode, addEvent, deleteEvent } = calendarSlice.actions;
export default calendarSlice.reducer;