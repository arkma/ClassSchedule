import React, { useEffect } from 'react';
import i18n from 'i18next';

import { Link } from 'react-router-dom';
import '../../styles/forms.scss';

import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import renderTextField from '../../share/renderedFields/input';

import { LOGIN_FORM } from '../../constants/reduxForms';
import { validation } from '../../constants/validation';
import { EMAIL_MESSAGE } from '../../constants/translationLabels/validationMessages';

import { required } from '../../validation/validateFields';
import {
    setScheduleGroupIdService,
    setScheduleSemesterIdService,
    setScheduleTeacherIdService,
    setScheduleTypeService,
} from '../../services/scheduleService';
import {
    PASSWORD_LABEL,
    EMAIL_LABEL,
    FORGOT_PASSWORD_LABEL,
    DONT_HAVE_ACCOUNT_LABEL,
} from '../../constants/translationLabels/formElements';
import {
    LOGIN_TITLE,
    EMPTY_FIELDS,
    REGISTRATION_PAGE_TITLE,
} from '../../constants/translationLabels/common';
import { links } from '../../constants/links';

const LoginForm = (props) => {
    const { handleSubmit, loginHandler, errors, setError, isLoading } = props;

    useEffect(() => {
        setScheduleSemesterIdService(0);
        setScheduleTeacherIdService(0);
        setScheduleGroupIdService(0);
        setScheduleTypeService('');
    });
    const isValidForm = (formValues) => {
        if (!formValues.email || !formValues.password) {
            setError({ login: i18n.t(EMPTY_FIELDS) });
            return false;
        }
        if (!validation.EMAIL.test(formValues.email)) {
            setError({ login: i18n.t(EMAIL_MESSAGE) });
            return false;
        }
        return true;
    };
    const onLogin = (values) => {
        const isValid = isValidForm(values);
        if (isValid) {
            loginHandler(values);
        }
    };
    const errorHandling = (value) => {
        if (required(value)) setError(required(value));
        else setError(null);
    };

    return (
        <Card className="auth-card">
            <div className="auth-card-header">
                <h2 className="title">{i18n.t(LOGIN_TITLE)}</h2>
            </div>

            {isLoading ? (
                <CircularProgress size="70px" className="loading-circle auth-loading" />
            ) : (
                <form onSubmit={handleSubmit(onLogin)} className="auth-form">
                    <Field
                        name="email"
                        className="form-input"
                        component={renderTextField}
                        label={i18n.t(EMAIL_LABEL)}
                        error={!!errors}
                        helperText={errors ? errors.login : null}
                        onChange={(e) => errorHandling(e.target.value)}
                    />
                    <Field
                        name="password"
                        className="form-input"
                        type="password"
                        component={renderTextField}
                        label={i18n.t(PASSWORD_LABEL)}
                        error={!!errors}
                        onChange={() => setError(null)}
                    />
                    <div className="forgot-password-label">
                        <Link to={links.RESET_PASSWORD} className="form-link">
                            {i18n.t(FORGOT_PASSWORD_LABEL)}
                        </Link>
                    </div>
                    <div className="auth-form-actions">
                        <Button
                            className="auth-confirm-button"
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            {i18n.t(LOGIN_TITLE)}
                        </Button>
                    </div>

                    <div className="auth-form-footer">
                        <span>{i18n.t(DONT_HAVE_ACCOUNT_LABEL)}</span>
                        <Link to={links.Registration} className="form-link">
                            {i18n.t(REGISTRATION_PAGE_TITLE)}
                        </Link>
                    </div>
                </form>
            )}
        </Card>
    );
};

const LoginReduxForm = reduxForm({
    form: LOGIN_FORM,
})(LoginForm);

export default LoginReduxForm;
