 /*전화번호에 hypen 자동으로 추가해주는 함수.*/
 
 function formatPhoneHypen(value) {
    // 숫자만 남기기
    const digits = String(value).replace(/\D/g, "");

    // 02(서울) 처리
    if (digits.startsWith("02")) {
      if (digits.length <= 2) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;          // 02-XXX
      if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`; // 02-XXX-XXXX
      return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;       // 02-XXXX-XXXX
    }

    // 그 외(010, 011, 031 등)
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;           // 010-XXXX
    if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;           // 010-XXX-XXXX
    else if (digits.length <= 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;  // 010-XXXX-XXXX

    // 너무 길면 잘라서 표시
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  } 