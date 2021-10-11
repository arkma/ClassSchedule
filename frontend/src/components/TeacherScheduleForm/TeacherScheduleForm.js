import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';

import { connect } from 'react-redux';

import './TeacherScheduleForm.scss';

import { MdPlayArrow, MdViewModule, MdViewHeadline } from 'react-icons/md';

import Button from '@material-ui/core/Button';

import { useTranslation } from 'react-i18next';
import * as moment from 'moment';
import { required, lessThanDate, greaterThanDate } from '../../validation/validateFields';

import { TEACHER_SCHEDULE_FORM } from '../../constants/reduxForms';
import renderMonthPicker from '../../share/renderedFields/timeSemester';
import Card from '../../share/Card/Card';
import { setTeacherServiceViewType } from '../../services/scheduleService';
import { CLASS_FROM_LABEL, CLASS_TO_LABEL } from '../../constants/translationLabels';
import {
    COMMON_LIST_VIEW,
    COMMON_SELECT_DATES_FOR_TEACHERS_SCHEDULE,
    COMMON_BLOCK_VIEW,
    FULL_SCHEDULE_LABEL,
} from '../../constants/translationLabels/common';

const TeacherScheduleForm = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit } = props;
    const isSchedule = false;

    useEffect(() => {
        props.initialize({
            startDay: moment(new Date(), 'DD/MM/YYYY').format('DD/MM/YYYY'),
            endDay: moment(new Date(), 'DD/MM/YYYY').add(7, 'd').format('DD/MM/YYYY'),
        });
    }, [isSchedule]);
    return (
        <Card class="form-card teacher-schedule-form">
            <form onSubmit={handleSubmit}>
                <div className="form-line-block">
                    <h2 className="form-title">{t(COMMON_SELECT_DATES_FOR_TEACHERS_SCHEDULE)}</h2>
                    <Field
                        className="time-input"
                        name="startDay"
                        component={renderMonthPicker}
                        label={`${t(CLASS_FROM_LABEL)}:`}
                        validate={[required, lessThanDate]}
                    />
                    <Field
                        className="time-input"
                        name="endDay"
                        component={renderMonthPicker}
                        label={`${t(CLASS_TO_LABEL)}:`}
                        validate={[required, greaterThanDate]}
                    />
                    <div className="form-buttons-container">
                        <Button
                            className="buttons-style"
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            <MdPlayArrow title={t(FULL_SCHEDULE_LABEL)} className="svg-btn" />
                        </Button>
                        <Button
                            className="view-type-icon first-view-type-button"
                            variant="contained"
                            color="secondary"
                            title={t(COMMON_BLOCK_VIEW)}
                            onClick={() => setTeacherServiceViewType('blocks-view')}
                        >
                            <MdViewModule className="svg-btn" />
                        </Button>
                        <Button
                            className="view-type-icon"
                            variant="contained"
                            color="secondary"
                            title={t(COMMON_LIST_VIEW)}
                            onClick={() => setTeacherServiceViewType('list-view')}
                        >
                            <MdViewHeadline className="svg-btn" />
                        </Button>
                    </div>
                </div>
            </form>
        </Card>
    );
};

const mapStateToProps = (state) => ({
    classScheduleOne: state.classActions.classScheduleOne,
});

export default connect(mapStateToProps)(
    reduxForm({
        form: TEACHER_SCHEDULE_FORM,
    })(TeacherScheduleForm),
);
