import * as Yup from 'yup';

export const SearchSchema = Yup.object().shape({
    fromCity: Yup.string().trim().required('From city is required'),
    toCity: Yup.string().trim().required('To city is required'),
    date: Yup.date().required('Date is required'),
});