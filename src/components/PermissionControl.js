const HasPermi = permissionId => {
    let permission = false;
    let testId = parseInt(permissionId);
    let permissionIdArr = [];
    let localStorageMenuObj = (JSON.parse(localStorage.getItem('fms.user'))) ? JSON.parse(localStorage.getItem('fms.user'))['menus_obj_s'] : [];
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