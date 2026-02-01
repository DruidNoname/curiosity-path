import React from "react";
import {DateCalendar, DateCalendarProps} from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {Locale, ru} from "date-fns/locale";

const russianLocale: Locale  = {
    ...ru,
    options: {
        ...ru.options,
        weekStartsOn: 1,
    },
};

const Calendar: React.FC<DateCalendarProps> = (props) => {
    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={russianLocale}
        >
            <DateCalendar
                {...props}
                views={['year', 'month', 'day']}
            />
        </LocalizationProvider>
    );
};
export default Calendar;