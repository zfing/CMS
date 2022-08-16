const HasPermi = permissionId => {
    const currentUser = (JSON.parse(localStorage.getItem('cms.user'))) ? JSON.parse(localStorage.getItem('cms.user'))['fms_user_obj'] : {};
    if (currentUser?.permi_type === 99) return true; // 管理员权限
    let permission = false;
    let testId = parseInt(permissionId);
    let permissionIdArr = [];
    let localStorageMenuObj = (JSON.parse(localStorage.getItem('cms.user'))) ? JSON.parse(localStorage.getItem('cms.user'))['menus_obj_s'] : [];
    localStorageMenuObj.map((selObj) => {
        permissionIdArr.push(selObj.id);
        return permissionIdArr;
    })
    if (permissionIdArr.indexOf(testId) !== -1) {
        permission = true;
    }
    return permission;
}
export default HasPermi;