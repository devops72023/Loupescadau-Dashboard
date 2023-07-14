import ProfileSvg from '/src/assets/Icons/profile.svg';
import AddUserSvg from '/src/assets/Icons/add-user.svg';
import CategorySvg from '/src/assets/Icons/category.svg';
import DashboardSvg from '/src/assets/Icons/dashboard.svg';
import EditSvg from '/src/assets/Icons/edit.svg';
import LogoutSvg from '/src/assets/Icons/logout.svg';
import MenuSvg from '/src/assets/Icons/menu.svg';
import PlusSvg from '/src/assets/Icons/plus.svg';
import ProductsSvg from '/src/assets/Icons/products.svg';
import SettingSvg from '/src/assets/Icons/setting.svg';
import ToLeftArrowSvg from '/src/assets/Icons/to-left-arrow.svg';
import TrashSvg from '/src/assets/Icons/trash.svg';
import UsersSvg from '/src/assets/Icons/users.svg';
import ImageImportSvg from '/src/assets/Icons/image_import.svg';
import colorsSvg from '/src/assets/Icons/colors.svg';
import GeneralInfosSvg from '/src/assets/Icons/general-infos.svg';
import CouponSvg from '/src/assets/Icons/coupon.svg';
import ConfirmSvg from '/src/assets/Icons/confirm.svg';
import CancelSvg from '/src/assets/Icons/cancel.svg';
import phoneSvg from '/src/assets/Icons/phone.svg';
import ExpandSvg from '/src/assets/Icons/expand.svg';
import CloseSvg from '/src/assets/Icons/close.svg';
import CameraSvg from '/src/assets/Icons/camera.svg';
import MicrophoneSvg from '/src/assets/Icons/microphone.svg';
import OrdersSvg from '/src/assets/Icons/orders.svg';
import EyeSvg from '/src/assets/Icons/eye.svg';
import EyeSlashSvg from '/src/assets/Icons/eye-slash.svg';

import { forwardRef, useEffect, useRef, createRef } from 'react';


const Icon = forwardRef((props, ref) => {
    const iconRef = ref || useRef();
    const className = "icon " + props.className;

    useEffect(() => {
        fetch(props.src)
        .then(response => response.text())
        .then(svgContent => {
            iconRef.current.innerHTML = svgContent
        });
    }, [])
    return (
        <div {...props} className={className} ref={iconRef} ></div>
    )
})

const ProfileIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="profile-icon" 
                    src={ProfileSvg} 
                    ref={iconRef}
                    {...props} />
    })
const AddUserIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="add-user-icon" 
                    src={AddUserSvg} 
                    ref={iconRef}
                    {...props} />
    })
const CategoryIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="category-icon" 
                    src={CategorySvg} 
                    ref={iconRef}
                    {...props} />
    })
const DashboardIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="dashboard-icon" 
                    src={DashboardSvg} 
                    ref={iconRef}
                    {...props} />
    })
const EditIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="edit-icon" 
                    src={EditSvg} 
                    ref={iconRef}
                    {...props} />
    })
const LogoutIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="logout-icon" 
                    src={LogoutSvg} 
                    ref={iconRef}
                    {...props} />
    })
const MenuIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="menu-icon" 
                    src={MenuSvg} 
                    ref={iconRef}
                    {...props} />
    })
const PlusIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="plus-icon" 
                    src={PlusSvg} 
                    ref={iconRef}
                    {...props} />
    })
const ProductsIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="products-icon" 
                    src={ProductsSvg} 
                    ref={iconRef}
                    {...props} />
    })
const SettingIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="setting-icon" 
                    src={SettingSvg} 
                    ref={iconRef}
                    {...props} />
    })
const ToLeftArrowIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="to-left-arrow-icon" 
                    src={ToLeftArrowSvg} 
                    ref={iconRef}
                    {...props} />
    })
const TrashIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="trash-icon" 
                    src={TrashSvg} 
                    ref={iconRef}
                    {...props} />
    })
const UsersIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="users-icon" 
                    src={UsersSvg} 
                    ref={iconRef}
                    {...props} />
    })
const ImageImportIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="image-import-icon" 
                    src={ImageImportSvg} 
                    ref={iconRef}
                    {...props} />
    })
const ColorsIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="image-import-icon" 
                    src={colorsSvg} 
                    ref={iconRef}
                    {...props} />
    })
const GeneralInfosIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="image-import-icon" 
                    src={GeneralInfosSvg} 
                    ref={iconRef}
                    {...props} />
    })

const CouponIcon = forwardRef((props, ref) => {
        const iconRef = ref || useRef();
        return <Icon 
                    className="image-import-icon" 
                    src={CouponSvg} 
                    ref={iconRef}
                    {...props} />
    })
const ConfirmIcon = forwardRef((props, ref) => {
    const iconRef = ref || useRef();
    return <Icon 
                className="confirm-icon" 
                src={ConfirmSvg} 
                ref={iconRef}
                {...props} />
})
const CancelIcon = forwardRef((props, ref) => {
    const iconRef = ref || useRef();
    return <Icon 
                className="cancel-icon" 
                src={CancelSvg}  
                ref={iconRef}
                {...props} />
})

const PhoneIcon = forwardRef((props, ref) => {
    const iconRef = ref || useRef();
    return <Icon 
                className="phone-icon" 
                src={phoneSvg}  
                ref={iconRef}
                {...props} />
})
const ExpandIcon = forwardRef((props, ref) => {
    const iconRef = ref || useRef();
    return <Icon 
                className="expand-icon" 
                src={ExpandSvg}
                ref={iconRef}
                {...props} />
})
const CloseIcon = forwardRef((props, ref) => {
    const iconRef = ref || useRef();
    return <Icon 
                className="close-icon" 
                src={CloseSvg}
                ref={iconRef}
                {...props} />
})
const CameraIcon = forwardRef((props, ref) => {
    const iconRef = ref || useRef();
    return <Icon 
                className="camera-icon" 
                src={CameraSvg}
                ref={iconRef}
                {...props} />
})
const MicrophoneIcon = forwardRef((props, ref) => {
    const iconRef = ref || useRef();
    return <Icon 
                className="microphone-icon" 
                src={MicrophoneSvg}
                ref={iconRef}
                {...props} />
})
const OrdersIcon = forwardRef((props, ref) => {
    const iconRef = ref || useRef();
    return <Icon 
                className="orders-icon" 
                src={OrdersSvg}
                ref={iconRef}
                {...props} />
})
const EyeIcon = forwardRef((props, ref) => {
    const iconRef = ref || useRef();
    return <Icon 
                className="eye-icon" 
                src={EyeSvg}
                ref={iconRef}
                {...props} />
})
const EyeSlashIcon = forwardRef((props, ref) => {
    const iconRef = ref || useRef();
    return <Icon 
                className="eye-slash-icon" 
                src={EyeSlashSvg}
                ref={iconRef}
                {...props} />
})
export default Icon;
export { ProfileIcon, AddUserIcon, CategoryIcon, DashboardIcon, EditIcon, LogoutIcon, MenuIcon, PlusIcon, ProductsIcon, SettingIcon, ToLeftArrowIcon, TrashIcon, UsersIcon, ImageImportIcon, ColorsIcon, GeneralInfosIcon, CouponIcon, ConfirmIcon, CancelIcon, PhoneIcon, ExpandIcon, CloseIcon, CameraIcon, MicrophoneIcon, OrdersIcon, EyeIcon, EyeSlashIcon }