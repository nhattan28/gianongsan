// Hàm chuyển đổi ngày dương sang âm bằng API miễn phí từ https://amlich.vn/api
async function getLunarDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const url = `https://amlich.vn/api/converter?dd=${day}&mm=${month}&yy=${year}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return `${data.lunarDay.toString().padStart(2, '0')}-${data.lunarMonth.toString().padStart(2, '0')}`;
  } catch (e) {
    return null;
  }
}

async function showLoiChuc() {
  const res = await fetch("le.json");
  const dsLe = await res.json();

  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const ngayDuong = `${dd}-${mm}`;
  const ngayAm = await getLunarDate(now);

  // Tìm ngày lễ hôm nay (dương + âm)
  const leHomNay = dsLe.find(le =>
    (le.loai === "duong" && le.ngay === ngayDuong) ||
    (le.loai === "am" && le.ngay === ngayAm)
  );

  if (leHomNay) {
    document.getElementById("ten-le").textContent = `🎉 ${leHomNay.ten}`;
    document.getElementById("loi-chuc").textContent = leHomNay.chuc;
  } else {
    document.getElementById("ten-le").textContent = `👋 Hôm nay không có lễ nào`;
    document.getElementById("loi-chuc").textContent = `Chúc bạn một ngày vui vẻ và tràn đầy năng lượng!`;

    // Tìm ngày lễ sắp tới (chỉ lấy lễ dương)
    const todayInt = parseInt(mm + dd); // ví dụ: 0609
    const sapToi = dsLe
      .filter(le => le.loai === "duong")
      .map(le => ({
        ten: le.ten,
        dateInt: parseInt(le.ngay.slice(3, 5) + le.ngay.slice(0, 2)), // MMDD dạng số
        ngay: le.ngay
      }))
      .filter(le => le.dateInt > todayInt)
      .sort((a, b) => a.dateInt - b.dateInt)[0];

    if (sapToi) {
      const timeEl = document.createElement("div");
      timeEl.style.marginTop = "8px";
      timeEl.style.fontSize = "0.85rem";
      timeEl.style.color = "#666";
      timeEl.innerHTML = `⏳ Sắp đến: <strong>${sapToi.ten}</strong> (${sapToi.ngay}/${yyyy})`;
      document.getElementById("loi-chuc").appendChild(timeEl);
    }
  }
}

showLoiChuc();
