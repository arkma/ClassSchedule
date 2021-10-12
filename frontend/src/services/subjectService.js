import { store } from '../index';
import axios from '../helper/axios';
import { DISABLED_SUBJECTS_URL, SUBJECT_URL } from '../constants/axios';
import { SUBJECT_FORM } from '../constants/reduxForms';
import {
    addSubject,
    clearSubject,
    deleteSubject,
    selectSubject,
    setDisabledSubjects,
    showAllSubjects,
    updateSubject,
} from '../redux/actions/index';
import i18n from '../helper/i18n';
import { errorHandler, successHandler } from '../helper/handlerAxios';
import { resetFormHandler } from '../helper/formHelper';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
} from '../constants/translationLabels';
import { FORM_SUBJECT_LABEL } from '../constants/translationLabels/formElements';

export const selectSubjectService = (subjectId) => store.dispatch(selectSubject(subjectId));

export const showAllSubjectsService = () => {
    axios
        .get(SUBJECT_URL)
        .then((response) => {
            store.dispatch(showAllSubjects(response.data));
        })
        .catch((error) => errorHandler(error));
};

export const getDisabledSubjectsService = () => {
    axios
        .get(DISABLED_SUBJECTS_URL)
        .then((res) => {
            store.dispatch(setDisabledSubjects(res.data));
        })
        .catch((error) => errorHandler(error));
};

export const updateSubjectService = (data) => {
    return axios
        .put(SUBJECT_URL, data)
        .then((response) => {
            store.dispatch(updateSubject(response.data));
            selectSubjectService(null);
            showAllSubjectsService();
            getDisabledSubjectsService();
            resetFormHandler(SUBJECT_FORM);
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_SUBJECT_LABEL),
                    actionType: i18n.t(UPDATED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const createSubjectService = (data) => {
    axios
        .post(SUBJECT_URL, data)
        .then((response) => {
            store.dispatch(addSubject(response.data));
            resetFormHandler(SUBJECT_FORM);
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_SUBJECT_LABEL),
                    actionType: i18n.t(CREATED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const handleSubjectService = (values) =>
    values.id ? updateSubjectService(values) : createSubjectService(values);

export const clearSubjectService = () => {
    store.dispatch(clearSubject());
    resetFormHandler(SUBJECT_FORM);
};

export const removeSubjectCardService = (subjectId) => {
    axios
        .delete(`${SUBJECT_URL}/${subjectId}`)
        .then(() => {
            store.dispatch(deleteSubject(subjectId));
            getDisabledSubjectsService();
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_SUBJECT_LABEL),
                    actionType: i18n.t(DELETED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const setDisabledSubjectsService = (subject) => {
    subject.disable = true;
    updateSubjectService(subject);
};

export const setEnabledSubjectsService = (subject) => {
    subject.disable = false;
    updateSubjectService(subject);
};
