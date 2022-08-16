import Axios from "axios";

const CommonConst = type => {
    let countryAndLanguageUrl = process.env.REACT_APP_BASE_URL.slice(0, process.env.REACT_APP_BASE_URL.indexOf('/v2'));
    const deviceTypes = [
        { 'v': -1, 't': '[-1]Unknown DeviceType' },
        { 'v': 0, 't': '[0]Classic italki [Old]' },
        { 'v': 1, 't': '[1]Global Mobile App [Old]' },
        { 'v': 2, 't': '[2]Global Android App [Old]' },
        { 'v': 3, 't': '[3]Global iOS App [Old]' },
        { 'v': 4, 't': '[4]WeChat official account [Old]' },
        { 'v': 5, 't': '[5]Classic CN Web [Old]' },
        { 'v': 7, 't': '[7]CN iOS App [Old]' },
        { 'v': 8, 't': '[8]CN Lite [Old]' },
        { 'v': 9, 't': '[9]WeChat APP' },
        { 'v': 10, 't': '[10]Global Student web' },
        { 'v': 11, 't': '[11]Global Teacher web' },
        { 'v': 12, 't': '[12]Android App Rigel' },
        { 'v': 13, 't': '[13]Stardust iOS App [Old]' },
        { 'v': 15, 't': '[15]CN Web Orion' },
        { 'v': 16, 't': '[16]App WebView Teacher/Community' },
        { 'v': 23, 't': '[23]iOS App Rigel' }
    ]
    switch (type) {
        default:
            console.log('error common const');
            break;
        case 'deviceType':

            return deviceTypes;
        case 'reportItemType':
            const reportItemType = [
                { 'v': 'USR-MBR', 't': 'User Profile' },
                { 'v': 'USR-TCR', 't': 'Teacher Profile' },
                { 'v': 'USR-SDT', 't': 'Student Profile' },
                { 'v': 'STU-LIST', 't': 'Student List' },
                { 'v': 'USR-FRT', 't': 'Follow request' },
                { 'v': 'USR-MSG', 't': 'User Message' },
                { 'v': 'ANR-QST', 't': 'Question' },
                { 'v': 'ANR-ANR', 't': 'Answer' },
                { 'v': 'ANR-CMT', 't': 'Question Comment' },
                { 'v': 'NBK-ETY', 't': 'Notebook' },
                { 'v': 'NBK-CRT', 't': 'Notebook Correction' },
                { 'v': 'NBK-CMT', 't': 'Notebook Comment' },
                { 'v': 'GRP-DCS', 't': 'Discussion' },
                { 'v': 'GRP-RPL', 't': 'Discussion Comment' },
                { 'v': 'CRS-CRS', 't': 'Course' },
                { 'v': 'USR-MSC', 't': '1ON1 Conversation' },
                { 'v': 'USR-MGC', 't': 'Group Conversation' },
                { 'v': 'LHM-HUM', 't': 'Hack User Missions' },
                { 'v': 'TEA-VIDEO', 't': 'Teacher Video' },
                { 'v': 'LHM-HMC', 't': 'Hack Mission Comment' },
                { 'v': 'C-POST', 't': 'CMS Posts' },
                { 'v': 'C-P-RESP', 't': 'CMS Posts Response' },
                { 'v': 'C-P-CMT', 't': 'CMS Posts Comment' },
                { 'v': 'C-ARTICLE', 't': 'CMS Article' },
                { 'v': 'C-A-RESP', 't': 'CMS Article Response' },
                { 'v': 'C-A-CMT', 't': 'CMS Article Comment' },
            ]
            return reportItemType;
        case 'ranking':
            const ranking = [
                { 'v': 'unresolved', 't': 'Unresolved' },
                { 'v': '-100', 't': 'Down' },
                { 'v': '0', 't': 'Reset' },
                { 'v': '1000', 't': 'Up' }
            ]
            return ranking;
        case 'neteaseLanguages':
            const neteaseLanguages = [
                { 'v': 'english', 't': 'English' },
                { 'v': 'german', 't': 'German' },
                { 'v': 'spanish', 't': 'Spanish' },
                { 'v': 'uyghur', 't': 'Uyghur' },
                { 'v': 'russian', 't': 'Russian' },
                { 'v': 'turkish', 't': 'Turkish' },
                { 'v': 'japanese', 't': 'Japanese' },
                { 'v': 'korean', 't': 'Korean' },
                { 'v': 'arabic', 't': 'Arabic' },
                { 'v': 'chinese', 't': 'Chinese' },
                { 'v': 'tibetan', 't': 'Tibetan' },
                { 'v': 'portuguese', 't': 'Portuguese' },
                { 'v': 'cantonese', 't': 'Cantonese' },
                { 'v': 'french', 't': 'French' },
                { 'v': 'italian', 't': 'Italian' },
                { 'v': 'minnan', 't': 'Minnan' },
                { 'v': 'thai', 't': 'Thai' }
            ]
            return neteaseLanguages;
        case 'languageCodeList':
            let languageCodeList;
            function sleep(time) {
                return new Promise((resolve) => setTimeout(resolve, time))
            }
            async function languageCode() {
                Axios.get(`${countryAndLanguageUrl}/oms/fetch-config-data?fetch_name=language_obj_s`)
                    .then(result => {
                        languageCodeList = result.data.data
                    })
                await sleep(0);
                return languageCodeList;
            }
            languageCode();
            break;
        case "lessonStatus":
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
            };
        case 'lessonsTool':
            return {
                '1': 'Skype',
                '2': 'MSN Messenger',
                '3': 'Yahoo! Messenger',
                '4': 'AOL Instant Messenger',
                '5': 'ICQ',
                '6': 'Google Hangouts',
                '7': 'QQ',
                '8': 'FaceTime',
                '9': 'Wechat',
                'Z': 'Classroom',
                'A':'Zoom'
            };
        case "reason":
            return {
                '1': 'Timezone Problem',
                '2': 'Tech Issue (Internet or Other)',
                '3': 'Accidental Dispute',
                '4': 'Student Didn\'t Attend',
                '5': 'Teacher Didn\'t Attend',
                '6': 'Real Dispute (Argument)',
                '7': 'Other',
                '51': '(D) Student booked the wrong package',
                '52': '(D) Student doesn\'t want to continue',
                '53': '(D) Teacher doesn\'t want to continue',
                '54': '(D) Student is not satisfied with the teacher',
                '55': '(D) Teacher is not satisfied with the student',
                '56': '(D) Both agree to terminate',
                '57': '(D) Others',
                '58': '(E) Teacher issues(lesson request expires/not log in for long time)',
                '59': '(E) Normal expired package',
                '81': '(E) The student ask to extend the package',
                '82': '(E) There are still upcoming lessons',
                '83': '(E) Teacher issues(lesson request expires/not log in for long time)',
                '84': '(E) Normal expired package',
                '85': '(E) Other'
            };
        case 'packageStatus':
            return {
                '0': '[0]Package request',
                '1': '[1]Student cancelled',
                '2': '[2]Expired',
                '3': '[3]Teacher modified (remove)',
                '6': '[6]Student modified (add)',
                '4': '[4]Teacher declined',
                '5': '[5]Reach an agreement',
                '7': '[7]Terminated',
                'C': '[C]Student requests to terminate',
                'B': '[B]Teacher requests to terminate',
                'F': '[F]Completed',
                'Z': '[Z]Frozen'
            };
        case 'videoStatus':
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
            }
    }
}
const EVENT = [{ v: 1, t: 'Registed' }, { v: 2, t: 'ITC Purchased' }, { v: 3, t: 'Lesson Completed' }];
const STATUS = [{ v: 0, t: 'Inactive' }, { v: 1, t: 'Active' }, { v: 2, t: 'Suspended' }];
const PLATFORM = {
    'appstore': 'AppStore',
    'xiaomi': '小米',
    'huawei': '华为',
    'baidu': '百度',
    'yingyongbao': '应用宝',
    '360': '360',
    'oppo': 'OPPO',
    'ali': '阿里',
    'vivo': 'VIVO',
    'sogou': '搜狗',
    'samsung': '三星',
    'italki': 'italki 官网',
    'italki_cn': 'italki-CN官网',
    'web': 'Web',
    'google_play': 'Google Play'
}
const COLOR = {
    "0": "orange",
    "1": "orange",
    "2": "green",
    "3": "red",
    "4": "red",
    "5": "red",
    "6": "red",
    "7": "orange",
}
export {
    EVENT,
    STATUS,
    PLATFORM,
    COLOR
}
export default CommonConst;
