
export const mapCommonUserStateToProps = (state) => {
    return {
        applicationProfile: state.userState.applicationProfile,
        masterHealthCenter: state.userState.masterHealthCenter,
        loggedUser: state.userState.loggedUser,
        loginStatus: state.userState.loginStatus,
        requestId: state.userState.requestId, 
        services: state.servicesState.services,
        mainApp: state.appState.mainApp
    }
}