'use client'

import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React from "react";
import {Locale, ru} from 'date-fns/locale';
import {Calendar} from "@/components/Calendar";

const russianLocale: Locale  = {
    ...ru,
    options: {
        ...ru.options,
        weekStartsOn: 1, // 0 - воскресенье, 1 - понедельник[citation:2]
    },
};
const TestSubject: React.FC = () => {

    return(
        <LocalizationProvider dateAdapter={AdapterDateFns}  adapterLocale={russianLocale}>
            <DateCalendar/>

            <DateCalendar
                views={['month', 'day']}
                view={'day'}
            />

            <Calendar/>
        </LocalizationProvider>
    );
};

export default TestSubject;