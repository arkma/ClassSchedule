import * as moment from 'moment';
import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import './SemesterForm.scss';
import { isEmpty, isNull } from 'lodash';
import renderCheckboxField from '../../share/renderedFields/checkbox';
import renderTextField from '../../share/renderedFields/input';
import renderMonthPicker from '../../share/renderedFields/timeSemester';
import {
    required,
    minYearValue,
    lessThanDate,
    greaterThanDate,
} from '../../validation/validateFields';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';
import Card from '../../share/Card/Card';
import {
    COMMON_EDIT,
    COMMON_CREATE,
    COMMON_SEMESTER,
    COMMON_CURRENT_LABEL,
    COMMON_DEFAULT_LABEL,
    COMMON_YEAR_LABEL,
    COMMON_CHOOSE_GROUPS_BUTTON_LABEL,
    COMMON_SEMESTER_LABEL,
    COMMON_CLASS_FROM_LABEL,
    COMMON_CLASS_TO_LABEL,
    COMMON_DAYS_LABEL,
    COMMON_CLASS_SCHEDULE_MANAGEMENT_TITLE,
    COMMON_SAVE_BUTTON_LABEL,
} from '../../constants/translationLabels/common';
import { SEMESTER_FORM } from '../../constants/reduxForms';
import { daysUppercase } from '../../constants/schedule/days';
import { dateFormat } from '../../constants/formats';
import { getToday, getTomorrow } from '../../utils/formUtils';

const weekDays = daysUppercase.reduce((init, item) => {
    const isCheckedDays = init;
    isCheckedDays[item] = false;
    return isCheckedDays;
}, {});

const createClasslabel = (classScheduler, classItem) => {
    const item = classScheduler.find((schedule) => schedule.id === +classItem);
    return `${item.class_name} (${item.startTime}-${item.endTime})`;
};
const SemesterForm = (props) => {
    const { t } = useTranslation('formElements');
    const {
        handleSubmit,
        pristine,
        onReset,
        submitting,
        semester,
        selected,
        setSelected,
        openDialogForGroup,
        classScheduler,
        initialize,
        change,
        selectedGroups,
        isChosenGroup,
    } = props;

    const prepSetCheckedClasses = classScheduler.reduce((init, item) => {
        const isChechedClasses = init;
        isChechedClasses[item.id] = false;
        return isChechedClasses;
    }, {});

    const [startValue, setStartValue] = useState();
    const [finishValue, setFinishValue] = useState();
    const [checkedClasses, setCheckedClasses] = useState(prepSetCheckedClasses);
    const [checkedDates, setCheckedDates] = useState(weekDays);
    const [current, setCurrent] = useState(false);
    const [byDefault, setByDefault] = useState(false);
    const [startTime] = useState(getToday());
    const [finishTime, setFinishTime] = useState(getTomorrow());
    const [disabledFinishDate, setDisabledFinishDate] = useState(true);

    const clearCheckboxes = () => {
        setCheckedClasses(prepSetCheckedClasses);
        setCurrent(false);
        setByDefault(false);
        setCheckedDates(weekDays);
    };
    useEffect(() => {
        const semesterItem = semester;
        clearCheckboxes();
        if (semester.id) {
            const newDays = {};
            const newClasses = {};
            semesterItem.semester_days.forEach((item) => {
                semesterItem[`semester_days_markup_${item}`] = true;
                newDays[item] = true;
            });

            setCheckedDates({
                ...weekDays,
                ...newDays,
            });

            semesterItem.semester_classes.forEach((item) => {
                semesterItem[`semester_classes_markup_${item.id}`] = true;
                newClasses[item.id] = true;
            });

            setCurrent(semester.currentSemester);
            setByDefault(semester.defaultSemester);

            setCheckedClasses({
                ...prepSetCheckedClasses,
                ...newClasses,
            });
        }
        initialize(semesterItem);
    }, [semester]);
    const getDisabledSaveButton = () => {
        if (!isEmpty(semester) && !isNull(semester.id)) {
            return (
                (selectedGroups.length > 0 ? !isChosenGroup() : selected.length === 0) &&
                (pristine || submitting)
            );
        }
        return pristine || submitting;
    };
    const setMinFinishDate = (time) => {
        const newDate = moment(time, dateFormat).add(1, 'd');
        return setFinishTime(newDate.toDate());
    };
    const setEndTime = (startTimeParam) => {
        if (disabledFinishDate || moment(startValue).isSameOrBefore(finishValue)) {
            setFinishValue(setMinFinishDate(startTimeParam));
            change('endDay', moment(startTimeParam, dateFormat).add(7, 'd').format(dateFormat));
        }
    };
    const setCheckedHandler = (event, item, checked, setSchecked) => {
        const changedItem = { [item]: event.target.checked };
        setSchecked({
            ...checked,
            ...changedItem,
        });
    };

    const setSemesterCheckboxes = (checked, method, name) => {
        const classes = Object.keys(checked);
        return classes.map((item) => {
            return (
                <Field
                    key={semester.id + item}
                    name={`${name}${item}`}
                    label={
                        name.indexOf('semester_days_markup_') >= 0
                            ? t(`common:day_of_week_${item}`)
                            : createClasslabel(classScheduler, item)
                    }
                    labelPlacement="end"
                    component={renderCheckboxField}
                    defaultValue={checked[item]}
                    checked={checked[item]}
                    onChange={(e) => {
                        setCheckedHandler(e, item, checked, method);
                    }}
                    color="primary"
                />
            );
        });
    };

    const handleChange = (event, setState) => setState(event.target.checked);
    return (
        <Card additionClassName="form-card semester-form">
            <h2 style={{ textAlign: 'center' }}>
                {semester.id ? t(COMMON_EDIT) : t(COMMON_CREATE)}
                {` ${t(COMMON_SEMESTER)}`}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="semester-checkbox group-options">
                    <div>
                        <Field
                            name="currentSemester"
                            label={t(COMMON_CURRENT_LABEL)}
                            labelPlacement="start"
                            component={renderCheckboxField}
                            checked={current}
                            onChange={(e) => handleChange(e, setCurrent)}
                            color="primary"
                        />
                        <Field
                            name="defaultSemester"
                            label={t(COMMON_DEFAULT_LABEL)}
                            labelPlacement="start"
                            component={renderCheckboxField}
                            checked={byDefault}
                            onChange={(e) => handleChange(e, setByDefault)}
                            color="primary"
                        />
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        className="buttons-style "
                        onClick={openDialogForGroup}
                    >
                        {t(COMMON_CHOOSE_GROUPS_BUTTON_LABEL)}
                    </Button>
                </div>
                <Field
                    className="form-field"
                    name="year"
                    type="number"
                    component={renderTextField}
                    label={`${t(COMMON_YEAR_LABEL)}:`}
                    validate={[required, minYearValue]}
                />
                <Field
                    className="form-field"
                    name="description"
                    component={renderTextField}
                    label={`${t(COMMON_SEMESTER_LABEL)}:`}
                    validate={[required]}
                />
                <div className="form-time-block">
                    <Field
                        className="time-input"
                        name="startDay"
                        component={renderMonthPicker}
                        label={`${t(COMMON_CLASS_FROM_LABEL)}:`}
                        validate={[required, lessThanDate]}
                        minDate={startTime}
                        onChange={(_, value) => {
                            if (value) {
                                setStartValue(value);
                                setMinFinishDate(value);
                                setEndTime(value);
                                setDisabledFinishDate(false);
                            }
                        }}
                    />
                    <Field
                        className="time-input"
                        name="endDay"
                        component={renderMonthPicker}
                        label={`${t(COMMON_CLASS_TO_LABEL)}:`}
                        validate={[required, greaterThanDate]}
                        minDate={finishTime}
                        disabled={disabledFinishDate}
                        onChange={(_, value) => {
                            setFinishValue(value);
                        }}
                    />
                </div>
                <div className="">
                    <p>{`${t(COMMON_DAYS_LABEL)}: `}</p>
                    {setSemesterCheckboxes(checkedDates, setCheckedDates, 'semester_days_markup_')}
                </div>
                <div className="">
                    <p>{`${t(COMMON_CLASS_SCHEDULE_MANAGEMENT_TITLE)}: `}</p>
                    {setSemesterCheckboxes(
                        checkedClasses,
                        setCheckedClasses,
                        'semester_classes_markup_',
                    )}
                </div>
                <div className="form-buttons-container semester-btns">
                    <Button
                        variant="contained"
                        color="primary"
                        className="buttons-style "
                        disabled={getDisabledSaveButton()}
                        type="submit"
                    >
                        {t(COMMON_SAVE_BUTTON_LABEL)}
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        className="buttons-style"
                        disabled={
                            setDisableButton(pristine, submitting, semester.id) &&
                            selected?.length === 0
                        }
                        onClick={() => {
                            onReset();
                            setSelected([]);
                        }}
                    >
                        {getClearOrCancelTitle(semester.id, t)}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default reduxForm({ form: SEMESTER_FORM })(SemesterForm);
