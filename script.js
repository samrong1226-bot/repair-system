function sendToGoogleSheet(data) {
  // แสดง loading
  const submitBtn = document.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> กำลังส่งข้อมูล...';
  submitBtn.disabled = true;

  // ใช้ URL ที่ถูกต้อง (ไม่มี space และเป็น /exec)
  fetch("https://script.google.com/macros/s/AKfycbxFEE67BAYc8hY-9eI5ydIaAKzX7DWvbxW5paUEJeVqeKvokbfrc29PKbJSrjMGleZ2zg/exec", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(result => {
    if (result.error) {
      throw new Error(result.error);
    }
    
    // แสดงผลสำเร็จ
    alert("✅ ส่งข้อมูลสำเร็จ!\nเลขที่แจ้งซ่อม: " + result.repairID);
    
    // รีเซ็ตฟอร์ม
    document.getElementById("repairForm").reset();
    document.getElementById("machineGroup").style.display = "none";
    document.getElementById("otherLocationGroup").style.display = "none";
  })
  .catch(error => {
    console.error("Error:", error);
    alert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล:\n" + error.message);
  })
  .finally(() => {
    // คืนค่าปุ่ม
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  });
}
