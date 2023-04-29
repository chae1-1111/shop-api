export default class UserRegExp {
  // 아이디
  // 영문 대소문자 + 숫자 6~16자
  static userIdRegExp: RegExp = /^[a-z]+[a-zA-Z0-9_\-.].{4,15}$/g;

  // 비밀번호
  // 영문 대소문자, 숫자, 특수문자 모두 포함, 8~20자
  static passwordRegExp: RegExp =
    /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[`~!@#$%^&*\(\)\-_\+\=,.\/?]).{8,20}$/;

  // 휴대폰번호
  // 010-000-0000
  // 010-0000-0000
  static phoneNumberRegExp: RegExp =
    /^01(?:0|1|[6-9])-[^0][0-9]{2,3}-[0-9]{4}$/;
}
