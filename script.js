// رابط Google Apps Script Web App
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby4ggznyoDxNdeAlY38Q1OUdElq872CqyDhktpn_rdFnZopg8t9hbysCfh-fbP_pZr0zQ/exec";

const heroImage = document.getElementById("heroImage");

document.querySelectorAll(".thumb").forEach(btn => {
  btn.addEventListener("click", () => {
    heroImage.src = btn.dataset.image;
    document.querySelectorAll(".thumb").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

const form = document.getElementById("orderForm");
const submitBtn = document.getElementById("submitBtn");
const statusBox = document.getElementById("status");

function showStatus(message, type) {
  statusBox.textContent = message;
  statusBox.className = "status show " + type;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = {
    name: formData.get("name").trim(),
    phone: formData.get("phone").trim(),
    city: formData.get("city").trim(),
    address: formData.get("address").trim(),
    size: formData.get("size")
  };

  if (!data.name || !data.phone || !data.city || !data.address || !data.size) {
    showStatus("يرجى ملء جميع المعلومات واختيار المقاس.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "جاري إرسال الطلب...";

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "تعذر تسجيل الطلب");
    }

    form.reset();
    showStatus("تم تسجيل طلبك بنجاح ✅ سنتواصل معك لتأكيد الطلب.", "success");
    submitBtn.textContent = "تم إرسال الطلب ✓";

  } catch (error) {
    console.error(error);
    showStatus(
      "حدثت مشكلة أثناء إرسال الطلب. إذا كان هذا أول اختبار، تأكد من نشر Apps Script كـ «تطبيق ويب» ومن اختيار «أي شخص» للوصول.",
      "error"
    );
    submitBtn.disabled = false;
    submitBtn.textContent = "تأكيد الطلب — 260 درهم";
  }
});
