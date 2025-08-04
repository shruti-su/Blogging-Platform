import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export const sweetAlert = () => {
    const MySwal = withReactContent(Swal)
    const showSuccess = (message) => {
        MySwal.fire({
            title: 'Success!',
            text: message,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }
    const showError = (message) => {
        MySwal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            confirmButtonText: 'Try Again'
        });
    }
    const showWarning = (message) => {
        MySwal.fire({
            title: 'Warning!',
            text: message,
            icon: 'warning',
            confirmButtonText: 'Ok'
        });
    }
    const showConfirm = async (message) => {
        const result = await MySwal.fire({
            title: 'Are you sure?',
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        });

        return result.isConfirmed; // true if user clicked "Yes", false if "Cancel"
    };
    return {
        showSuccess,
        showError,
        showWarning,
        showConfirm
    
    };
}