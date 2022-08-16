import React from 'react';
const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('fms.user'))
    return (
        <div>
            <div className="padding-left-30 dashboard-font">
                欢迎来到课程管理系统 
                <br />
                {user?.username}
                {user?.italki_email
                    ? ` / ${JSON.parse(localStorage.getItem('fms.user'))['italki_email']}` 
                    : null
                }
            </div>
        </div>
    );
}

export default Dashboard;