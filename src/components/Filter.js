import CommonConst from "./CommonConst";
import { getLanguageCountry, defaultAvatar } from "./CommonComponent/CommonFunction";
const countryCodeList = require('../Untils/country.json')

const Filter = (type, data, size) => {
    switch (type) {
        default:
            console.log('filter Error,Please enter the correct format')
            break;
        // user complaint filter
        case 'html':
            if (!data) return '';
            return data.replace(/<[^>]+>/g, '')
        case 'country':
            if (!data) return '';
            let country = countryCodeList.filter(item => item.v === data);
            return country[0]?.t;
        case 'ghostedReason':
            if (!data) return '';
            return {
                'automatic': 'Automatic',
                '1': 'BLOCK_DISCUSSION',
                '2': 'BLOCK_DISCUSSION_COMMENT',
                '3': 'BLOCK_NOTEBOOK',
                '4': 'BLOCK_NOTEBOOK_COMMENT',
                '5': 'BLOCK_NOTEBOOK_CORRECTION',
                '6': 'BLOCK_NOTEBOOK_CORRECTION_COMMENT',
                '7': 'BLOCK_QUESTION',
                '8': 'BLOCK_ANSWER',
                '9': 'BLOCK_QUESTION_ANSWER_COMMENT',
                '10': 'BLOCK_QUESTION_COMMENT',
                '11': 'BLOCK_USER_COMPLAINT',
                '12': 'BLOCK_DOMAIN',
                '13': 'BLOCK_IP_FILTER',
                '14': 'BLOCK_NICKNAME',
                '15': 'BLOCK_INTRO',
                '16': 'BLOCK_INTRODUCTION',
                '17': 'BLOCK_INTEREST',
                '18': 'BLOCK_FRIEND_REQUEST',
                '19': 'REASON_TYPE_V_BLOCK_HACK_USERMISSION',
                '20': 'REASON_TYPE_V_BLOCK_HACK_USERMISSION_COMMENT',
                '21': 'REASON_TYPE_V_REGISTER_SAME_BROWSER',
                '100': 'BLOCK BY ADMIN',
                'manual': 'Manual'
            }[data] || data.toString();
        case 'studentType':
            if (!data) return '';
            return {
                1: 'All Student',
                2: 'New Student',
                3: 'Old Student'
            }[data] || data.toString();
        case 'categoryStatus':
            if (!data) return '';
            return {
                'CA001': 'General',
                'CA002': 'Business',
                'CA003': 'Test Preparation',
                'CA004': 'For Kids',
                'CA005': 'Conversation Practice'
            }[data] || data.toString();
        case 'teacherStatus':
            if (!data && data !== 0) return '';
            return {
                '0': 'New apply',
                '1': 'Approved',
                '2': 'Declined',
                '3': 'Permanent Reject',
                '4': 'Re-apply',
                '5': 'Reject Released',
                '6': 'Canceled Teacher',
                '7': 'Upgrade Request',
                '8': 'Upgrade Approved',
                '9': 'Upgrade Declined',
                '10': 'Downgraded',
                '11': 'Pre-approved',
                '12': 'Call Booked Yes',
                '13': 'Call Completed Yes',
                '14': 'Applicant Absent',
                '15': 'Call Postponed',
                '20': 'Assigned to Admin',
                '21': 'Added Waitlist',
                '22': 'Removed Waitlist',
                '23': 'Added Recommended',
                '24': 'Canceled Recommended',
                '26': 'ID Check-Pending',
                '27': 'ID Check-Approved',
                '28': 'ID Check-Resubmit',
                '29': 'ID Check-Declined',
                '97': 'Deactivated',
                '98': 'Deactivated',
                '99': 'Suspended'
            }[data] || data.toString();
        case 'studentAcceptStatus':
            if (!data && data !== 0) return '';
            return {
                0: 'Any student can request lessons',
                1: "New students cannot request lessons",
                2: "New students cannot request lessons (system)",
                3: 'Students cannot request lessons (system)',
                4: 'Students cannot request lessons (admin-only)',
                5: 'All student cann\'t request lessons - Teacher Setting'
            }[data] || data.toString();
        case 'autoAcceptStatusTeacher':
            if (!data && data !== 0) return '';
            return {
                0: 'Manually Accept',
                1: 'Automatically Accept',
                2: 'Teacher cann\'t automatically accept & cann\'t setting'
            }[data] || data.toString();
        case 'materialType':
            if (!data && data !== 0) return '';
            return {
                '1': 'PDF file',
                '2': 'Text Documents',
                '3': 'Presentation slides/PPT',
                '4': 'Audio files',
                '5': 'Image files',
                '6': 'Video files',
                '7': 'Flashcards',
                '8': 'Articles and news',
                '9': 'Quizzes',
                '10': 'Test templates and examples',
                '11': 'Graphs and charts',
                '12': 'Homework assignments'
            }[data.toString()] || data.toString();

        case 'autoAcceptStatus':
            if (!data && data !== 0) return '';
            return {
                0: 'Preprocessing',
                1: 'User uploaded',
                2: 'Decoding in Qiniu',
                3: 'Decoding failed',
                4: 'Decoding succeeded',
                5: 'OMS approved',
                6: 'Approved & Uploaded to Youtube',
                7: 'OMS rejected',
                8: 'Video deleted',
                9: 'Uploading to Youtube',
                10: 'Uploaded to Youtube failed',
                11: 'Uploading to Qiniu'
            }[data] || data.toString();
        case 'videoStatus':
            if (!data && data !== 0) return '';
            return {
                0: 'Preprocessing',
                1: 'User uploaded',
                2: 'Decoding in Qiniu',
                3: 'Decoding failed',
                4: 'Decoding succeeded',
                5: 'OMS approved',
                6: 'Approved & Uploaded to Youtube',
                7: 'OMS rejected',
                8: 'Video deleted',
                9: 'Uploading to Youtube',
                10: 'Uploaded to Youtube failed',
                11: 'Uploading to Qiniu'
            }[data] || data.toString();
        case 'complaintReportType':
            if (!!!data) return '';
            return {
                'USR-MBR': 'User Profile',
                'USR-TCR': 'Teacher Profile',
                'USR-SDT': 'Student Profile',
                'STU-LIST': 'Student List',
                'USR-FRT': 'Follow request',
                'USR-MSG': 'User Message',
                'ANR-QST': 'Question',
                'ANR-ANR': 'Answer',
                'ANR-CMT': 'Question Comment',
                'NBK-ETY': 'Notebook',
                'NBK-CRT': 'Notebook Correction',
                'NBK-CMT': 'Notebook Comment',
                'GRP-DCS': 'Discussion',
                'GRP-RPL': 'Discussion Comment',
                'CRS-CRS': 'Course',
                'USR-MSC': '1ON1 Conversation',
                'USR-MGC': 'Group Conversation',
                'LHM-HUM': 'Hack User Missions',
                'TEA-VIDEO': 'Teacher Video',
                'LHM-HMC': 'Hack Mission Comment',
                'C-POST': 'Community Posts',
                'C-P-RESP': 'Community Posts Response',
                'C-P-CMT': 'Community Posts Comment',
                'C-ARTICLE': 'Community Article',
                'C-A-RESP': 'Community Article Response',
                'C-A-CMT': 'Community Article Comment',
                'C-USER': 'Community User'
            }[data] || data.toString();
        case 'complaintResolveStatus':
            if (!data && data !== 0) return '';
            return {
                0: 'Unresolved',
                1: 'Resolved',
                2: 'Wait for user response',
                3: 'Ignore'
            }[data] || data.toString();
        case 'ghostedReasonFilter':
            if (!!!data) return '';
            return {
                'automatic': 'Automatic',
                '1': 'BLOCK_DISCUSSION',
                '2': 'BLOCK_DISCUSSION_COMMENT',
                '3': 'BLOCK_NOTEBOOK',
                '4': 'BLOCK_NOTEBOOK_COMMENT',
                '5': 'BLOCK_NOTEBOOK_CORRECTION',
                '6': 'BLOCK_NOTEBOOK_CORRECTION_COMMENT',
                '7': 'BLOCK_QUESTION',
                '8': 'BLOCK_ANSWER',
                '9': 'BLOCK_QUESTION_ANSWER_COMMENT',
                '10': 'BLOCK_QUESTION_COMMENT',
                '11': 'BLOCK_USER_COMPLAINT',
                '12': 'BLOCK_DOMAIN',
                '13': 'BLOCK_IP_FILTER',
                '14': 'BLOCK_NICKNAME',
                '15': 'BLOCK_INTRO',
                '16': 'BLOCK_INTRODUCTION',
                '17': 'BLOCK_INTEREST',
                '18': 'BLOCK_FRIEND_REQUEST',
                '100': 'BLOCK BY ADMIN',
                'manual': 'Manual'
            }[data] || data.toString();
        case 'messageStatus':
            if (!data && data !== 0) return '';
            return {
                '0': 'Visible',
                '1': 'Need Approval',
                '2': 'Automatic Ghosted',
                '3': 'Admin Ghost'
            }[data] || data.toString();
        case 'messageType':
            if (!!!data) return '';
            return {
                1: 'User To User',
                2: 'File Sharing',
                5: 'Admin To User',
                8: 'Lesson Notify',
                9: 'Reverse Booking Order Message',
                10: 'Simple System',
                11: 'Connect Teacher',
                12: 'Article List Template Message',
                13: 'New Simple System',
                14: 'New Connect Teacher',
                15: 'Base Community Message',
                16: 'Base System Message',
                17: 'New Admin To User',
                21: 'Voice Message',
                22: 'Image Message',
                23: 'Document'
            }[data] || data.toString();
        case 'activeOrDeactivated':
            return {
                0: 'Active',
                1: 'Inactive'
            }[data] || data.toString();
        case 'status':
            return {
                '*': 'All',
                '0': 'Hidden',
                '1': 'Visible',
                '-1': 'Deleted'
            }[data] || data.toString();
        case 'CMSStatus':
            return {
                'OK': 'Published',
                '0': 'Draft',
                '-1': 'Published Delete',
                '-2': 'Draft Deleted'
            }[data] || data.toString();
        case 'userIdentity':
            if (!data) return '';
            if (data.is_pro > 0 || data.is_tutor > 0) {
                return 'Teacher'
            } else if (data.purchase_sum > 0) {
                return 'Student'
            } return 'User'
        case 'italkiSystemName':
            if ([0, 1, 2].indexOf(data) === -1) return '';
            return {
                '0': 'italki Notification',
                '1': 'Service Notification',
                '2': 'italki Promotion',
            }[data] || data.toString();
        case 'userEmailLogStatus':
            if (!data && data !== 0) return '';
            return {
                '0': 'Inactive',
                '1': 'Active',
                '-1': 'Deleted',
            }[data] || data.toString();
        case 'fileCategory':
            if (!data && data !== 0) return '';
            return {
                0: 'Other ',
                1: 'Picture ',
                2: 'Movie ',
                3: 'Music ',
                4: 'Document '
            }[data] || data.toString();
        case 'deviceType':
            if (!data && data !== 0) return '';
            return {
                '-1': '[-1]Unknown DeviceType',
                '0': '[0]Classic italki [Old]',
                '1': '[1]Global Mobile App [Old]',
                '2': '[2]Global Android App [Old]',
                '3': '[3]Global iOS App [Old]',
                '4': '[4]WeChat official account [Old]',
                '5': '[5]Classic CN Web [Old]',
                '7': '[7]CN iOS App [Old]',
                '8': '[8]CN Lite [Old]',
                '9': '[9]WeChat APP',
                '10': '[10]Global Student web',
                '11': '[11]Global Teacher web',
                '12': '[12]Android App Rigel',
                '13': '[13]Stardust iOS App [Old]',
                '15': '[15]CN Web Orion',
                '16': '[16]App WebView Teacher/Community',
                '23': '[23]iOS App Rigel'
            }[data.toString()];
        case 'channelType':
            if (!data && data !== 0) return '';
            return {
                '1': '[1]Global',
                '2': '[2]China'
            }[data.toString()] || data.toString();
        case 'postType':
            if (!!!data) return '';
            return {
                'EXERCISE': 'Exercises',
                'QUESTION': 'Questions',
                'POST': 'General Posts'
            }[data] || data.toString();
        case 'profileUri':
            if (!!!data) return '';
            return `${process.env.REACT_APP_BASE_URL.replace('api/v2/', `ns/user/${data.id}/${data.type}`)}`
        case 'violationType':
            if (!!!data) return '';
            return {
                'spam_ad': 'Spam (advertisements)',
                'harassment': 'Harassment',
                'hate_speech': 'Hate speech ',
                'sexual': 'Sexual content ',
                'political_religious': 'Political or religious discussions',
                'property_violations': 'Intellectual property violations',
                'threats': 'Threats',
                'fake': 'Impersonation or misrepresentation',
                'phishing': 'Phishing',
                'privacy_violations': 'Privacy violations',
                'fraud': 'Fraud',
                'other': 'Other'
            }[data] || data.toString();
        case 'complaintReason':
            if (!!!data) return '';
            return {
                100: 'Porn',
                110: 'Porn - Sexy',
                200: 'Advertising',
                210: 'Advertising - QR code',
                260: 'Advertising - Advertising Law',
                300: 'Terrorism',
                400: 'Contraband',
                500: 'Political',
                600: 'Abuses',
                700: 'Meaningless',
                800: 'Nausea',
                900: 'Other'
            }[data] || data.toString();
        case 'blockType':
            if (!!!data) return '';
            return {
                'GDPR': 'GDPR',
                'FRAUD': 'Fraud',
                'SEXHA': 'Sexual Harassment',
                'AD': 'Advertisement',
                'OTHER': 'Other'
            }[data] || data.toString();
        case 'identity':
            if (!!!data && data !== 0) return '';
            return {
                '0': 'Suspect',
                '1': 'Ignore',
                '-1': 'Illegal'
            }[data] || data.toString();
        case 'netEaseVerify':
            if (!!!data && data !== 0) return '';
            return {
                '0': 'Pass',
                '1': 'Suspect',
                '2': 'Fail'
            }[data] || data.toString();
        // 语言首字母大写
        case 'language':
            if (!!!data) return '';
            let result;
            result = data === '*' ? 'All Languages' : data.substring(0, 1).toUpperCase() + data.substring(1).toLowerCase()
            return result;
        case 'defaultPagination':
            const defaultPaginationObj = {
                pageSize: 20,
                current: 1,
                pageSizeOptions: ['10', '20', '50', '100'],
                showSizeChanger: true,
                total: data,
                showTotal: ((total) => {
                    return `Total ${total} items`
                })
            }
            return defaultPaginationObj;
        // 首字母大写 
        case 'firstLetterCap':
            if (!!!data) return 'Null';
            return data.substring(0, 1).toUpperCase() + data.substring(1).toLowerCase();
        case 'addWrap':
            if (!!!data) return ''
            let defaultContent = data;
            defaultContent = defaultContent.replace(/<\/p>/g, '</p>\r\n');
            defaultContent = defaultContent.replace(/<\/h2>/g, '</h2>\r\n');
            defaultContent = defaultContent.replace(/<\/h3>/g, '</h3>\r\n');
            return defaultContent;
        //  图片
        case 'payType':
            if (!data) return '';
            let tempPayType = JSON.parse(localStorage.getItem('paymentConfig'));
            tempPayType = tempPayType.filter(item => item.pay_type === data);
            return tempPayType[0]?.name;
        case 'withdrawStatus':
            if (!data && data !== 0) return '';
            return {
                '0': '(0)Pending Approval',
                '1': '(1)Approved; will pay',
                '2': '(2)Completed',
                '3': '(3)Unapproved',
                '4': '(4)ITALKI Canceled',
                '5': '(5)Teacher canceled',
                '6': '(6)Withdrawal reversed',
                '7': '(7)Cash has been paid',
                '-1': 'Uploaded file to Hyperwallet'
            }[data.toString()] || data.toString();
        case 'withdrawType':
            if (!data && data !== 0) return '';
            return {
                1: 'Not immediately',
                2: 'Immediately'
            }[data] || data.toString();
        case 'idVerification':
            if (!data && data !== 0) return 'Unverified';
            return {
                '0': 'Unverified',
                '26': 'Pending',
                '27': 'Approved',
                '28': 'Resubmit',
                '29': 'Declined'
            }[data] || data.toString()
        case 'purchaseStatus':
            if (!data) return '';
            return {
                0: 'Requested',
                1: 'Completed',
                2: 'Pending',
                3: 'Cancelled',
                //4: 'Frozen',
                5: 'Failed',
                6: 'Refund'
            }[data] || data.toString();
        case 'thirdPartyAccount':
            if (!data) return '';
            return {
                1: 'Facebook',
                2: 'Google',
                3: 'Yahoo',
                4: 'Microsoft',
                5: 'Twitter',
                8: 'Linkedin',
                9: 'Wechat',
                10: 'Phone No.',
                12: 'Apple',
                13: 'VK'
            }[data] || data.toString();
        case 'ranking':
            if (!data && data !== 0) return 'Unresolved';
            return {
                '-100': 'Down',
                '1000': 'Up',
                '0': 'Reset'
            }[data] || data.toString();
        case 'neteaseLanguage':
            if (!!!data) return '';
            let temp = CommonConst('neteaseLanguages');
            const reducer = (item, currentValue) => Object.assign(item, { [currentValue.v]: currentValue.t })
            let tempObj = temp.reduce(reducer, {})
            return tempObj[data] || data.toString();
        case 'articleType':
            if (!!!data) return 'Learning Article';
            // All Options
            return {
                '': 'Learning Article',
                'PROMOTIONAL': 'Promotion Article'
            }[data];
        case 'languageTestProgress':
            if (!data) return '';
            return {
                "NOT_STARTED": 'Not Started',
                "CANCELLED": 'Cancelled',
                "IN_PROGRESS": 'In Progress',
                "COMPLETED": 'Completed',
            }[data];
        case 'languageEmmersionProgress':
            if (!data) return '';
            return {
                "NOT_STARTED": 'Not Started',
                "CANCELLED": 'Cancelled',
                "SCORE_PENDING": 'Score Pending',
                "COMPLETED": 'Completed',
                "NEEDS_REVIEW": 'Needs Review',
                "IN_PROGRESS": 'In Progress'
            }[data];
        case 'gender':
            if (!data) return 'Unknow';
            return {
                '1': 'Female',
                '2': 'Male'
            }[data] || data.toString();
        case 'sessionStatus':
            if (!data) return '';
            return {
                '0': '[0]Lesson request',
                '1': '[1]Student cancelled',
                '2': '[2]Expired',
                '3': '[3]Teacher modified',
                '4': '[4]Teacher cancelled',
                '5': '[5]Change time request',
                '6': '[6]Upcoming',
                '7': '[7]Needs confirmation',
                '9': '[9]Lesson Cancellation Request',
                'C': '[C]In problem Request',
                'E': '[E]Problem resolved',
                'F': '[F]Completed',
                'G': '[G]Teacher feedback',
                'H': '[H]italki handle',
                'P': '[P]Problem resolved - Package Lesson',
                'S': '[S]In Problem - Rescheduling',
                'Q': '[Q]Problem No reschedule time',
                'O': '[O]Problem Reschedule request',
                'W': '[W]Problem Upcoming',
                'X': '[X]Lesson Cancelled',
                'Z': '[Z]italki cancelled'
            }[data] || data.toString();
        case 'langLevel':
            if (!data) return 'Level 0';
            return ["", "A1:Beginner", "A2:Elementary", "B1:Intermediate", "B2:Upper Intermediate", "C1:Advanced", "C2:Proficient", "Native"][data] || "";
        case 'kpAvatar':
            const avatar = () => {
                data = data ? data : "no_pic";
                if (typeof (data) === 'object') {
                    if (data.avatar_file_name) {
                        data = data.avatar_file_name;
                        data = (data === "T000000000" ? "T0" : data);
                    } else {
                        data = "no_pic";
                    }
                }
                if (data === "no_pic") {
                    return defaultAvatar()
                    // return `https://www.italki.com/static/images/no_pic${size ? size : 150}.jpg`
                }
                switch (size) {
                    case 100:
                        size = '_1';
                        break;
                    case 75:
                        size = '_2';
                        break;
                    case 50:
                        size = '_3';
                        break;
                    default:
                        size = ''
                }
                //不同环境链接地址作区分
                return process.env.REACT_APP_CURRENT_URL ? `${process.env.REACT_APP_CURRENT_URL}/${data}_Avatar${size}.jpg` : defaultAvatar()
                // return ENV.avatorUrl + '/' + data + '_Avatar' + size + '.jpg';
            }
            return avatar();
        case 'affSettlementType':
            if (!data) return '';
            if (data === 1) {
                return 'Fixed rate'
            }
            if (data > 1) {
                return `Tiered rate - ${data - 1}`
            }
            return 'Unknown'
        case 'gt':
            if (!data) return 'Null';
            if (data) {
                data = data.toString().trim()
            }
            const r = getLanguageCountry()[data];
            if (r) {
                return r
            } return data
    }
}
export default Filter;