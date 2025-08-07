document.addEventListener("DOMContentLoaded", function () {
  // Set current datetime
  const now = new Date();
  document.getElementById("datetime").value = now.toLocaleString("th-TH");

  // Load machine list based on location
  document.getElementById("location").addEventListener("change", function () {
    const loc = this.value;
    const machineGroup = document.getElementById("machineGroup");
    const otherGroup = document.getElementById("otherLocationGroup");

    if (loc === "other") {
      machineGroup.style.display = "none";
      otherGroup.style.display = "block";
    } else {
      otherGroup.style.display = "none";
      machineGroup.style.display = "block";
      loadMachines(loc);
    }
  });

  // Submit form
  document.getElementById("repairForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    // รวบรวมข้อมูลจากฟอร์ม
    const formData = {
      datetime: document.getElementById("datetime").value,
      jobType: document.getElementById("jobType").value,
      location: document.getElementById("location").value,
      machine: document.getElementById("machine").value,
      otherLocation: document.getElementById("otherLocation").value,
      problem: document.getElementById("problem").value,
      note: document.getElementById("note").value,
      reporter: document.getElementById("reporter").value
    };

    // แสดงข้อมูลใน console (ทดสอบเบื้องต้น)
    console.log(formData);
    alert("ระบบยังไม่ได้เชื่อมต่อกับ Google Sheet จริง ต้องใช้ Google Apps Script");
    
    // ถ้าจะส่งจริง ให้เปิด comment ส่วนล่างนี้
    /*
    fetch("https://script.google.com/macros/s/YOUR_SCRIPT_URL/exec", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.text())
    .then(data => {
      alert(data);
      document.getElementById("repairForm").reset();
    })
    .catch(error => console.error("Error:", error));
    */
  });
});

function loadMachines(location) {
  // ดึงข้อมูลเครื่องจักรจาก Google Sheet ผ่าน API
  // ตัวอย่างนี้ใช้ placeholder
  const machines = {
    "Line 1": ["Machine A", "Machine B"],
    "Line 2": ["Machine C", "Machine D"]
  };

  const select = document.getElementById("machine");
  select.innerHTML = '<option value="">เลือกเครื่องจักร</option>';
  if (machines[location]) {
    machines[location].forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.text = m;
      select.appendChild(opt);
    });
  }
}
