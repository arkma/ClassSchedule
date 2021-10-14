import './ProfilePage.scss';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Card from '../../share/Card/Card';
import { resetFormHandler } from '../../helper/formHelper';
import { PROFILE_FORM, TEACHER_FORM } from '../../constants/reduxForms';
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';
import { getUserProfile, updateUserPassword, updateUserTeacher } from '../../services/userService';
import AddTeacherForm from '../../components/AddTeacherForm/AddTeacherForm';
import NavigationPage from '../../components/Navigation/NavigationPage';

const ProfilePage = (props) => {
    const { t } = useTranslation('formElements');

    const handlePasswordFormReset = () => resetFormHandler(PROFILE_FORM);
    const submitPasswordChange = (values) => {
        if (values.new_password !== values.confirm_password) {
            props.setError({
                registration: { passwords: t('different_passwords') },
            });
            return;
        }
        updateUserPassword(values);
        handlePasswordFormReset();
    };

    const submitTeacherChange = (values) => {
        updateUserTeacher(values);
    };
    const handleTeacherFormReset = () => resetFormHandler(TEACHER_FORM);
    useEffect(() => {
        getUserProfile();
    }, [localStorage.getItem('userRole')]);

    const renderTeacherdataForm = () => {
        if (localStorage.getItem('userRole') === 'ROLE_TEACHER') {
            return (
                <AddTeacherForm onSubmit={submitTeacherChange} onReset={handleTeacherFormReset} />
            );
        }
        return null;
    };

    return (
        <>
            <NavigationPage />
            <Card additionClassName="form-card">
                <h2 className="form-title">{t('common:my_profile')}</h2>
                <section>
                    <span>{`${t('email_label')}: `}</span>
                    <span>{localStorage.getItem('email')}</span>
                </section>
                <ChangePasswordForm
                    onSubmit={submitPasswordChange}
                    onReset={handlePasswordFormReset}
                />
            </Card>
            {renderTeacherdataForm()}
        </>
    );
};

const mapStateToProps = (state) => ({
    user: state.users.user,
});

export default connect(mapStateToProps)(ProfilePage);
