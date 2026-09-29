/* =========================================
   GOOGLE APPS SCRIPT URL
========================================= */

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyKDZV_9nTFBYBukB8nA-f4UGBFQe9K-pMcqhLhFHjHthNKAYIqz-2UNbVM7AaXFjFj-A/exec";


/* =========================================
   ELEMENTS
========================================= */

const form = document.getElementById("orderForm");

const submitBtn =
    document.getElementById("submitBtn");

const buttonText =
    document.getElementById("buttonText");

const buttonLoader =
    document.getElementById("buttonLoader");

const successMessage =
    document.getElementById("successMessage");

const mainProductImage =
    document.getElementById("mainProductImage");

const thumbnails =
    document.querySelectorAll(".thumb");


/* =========================================
   PRODUCT IMAGE SWITCH
========================================= */

thumbnails.forEach((thumb) => {

    thumb.addEventListener("click", () => {

        const image =
            thumb.dataset.image;

        const color =
            thumb.dataset.color;


        /*
         * تغيير الصورة
         */

        mainProductImage.style.opacity = "0";


        setTimeout(() => {

            mainProductImage.src = image;

            mainProductImage.style.opacity = "1";

        }, 120);


        /*
         * تغيير الزر النشط
         */

        thumbnails.forEach((item) => {
            item.classList.remove("active");
        });

        thumb.classList.add("active");


        /*
         * تحديد اللون تلقائياً في الفورم
         */

        const colorInput =
            document.querySelector(
                `input[name="color"][value="${color}"]`
            );

        if (colorInput) {
            colorInput.checked = true;
        }

    });

});


/* =========================================
   PHONE VALIDATION
========================================= */

function normalizePhone(phone) {

    return phone
        .replace(/\s+/g, "")
        .replace(/-/g, "")
        .replace(/\(/g, "")
        .replace(/\)/g, "");
}


function isValidMoroccanPhone(phone) {

    const clean =
        normalizePhone(phone);


    /*
     * 06xxxxxxxx
     * 07xxxxxxxx
     * +2126xxxxxxxx
     * +2127xxxxxxxx
     */

    const pattern =
        /^(06|07)[0-9]{8}$/;

    const internationalPattern =
        /^\+212[67][0-9]{8}$/;


    return (
        pattern.test(clean) ||
        internationalPattern.test(clean)
    );
}


/* =========================================
   SUCCESS MESSAGE
========================================= */

function showSuccess() {

    successMessage.classList.remove("hidden");

    document.body.style.overflow = "hidden";

}


function closeSuccess() {

    successMessage.classList.add("hidden");

    document.body.style.overflow = "";

}


/* =========================================
   LOADING STATE
========================================= */

function setLoading(loading) {

    if (loading) {

        submitBtn.disabled = true;

        buttonText.classList.add("hidden");

        buttonLoader.classList.remove("hidden");

    } else {

        submitBtn.disabled = false;

        buttonText.classList.remove("hidden");

        buttonLoader.classList.add("hidden");

    }

}


/* =========================================
   FORM SUBMISSION
========================================= */

form.addEventListener("submit", async function(event) {

    event.preventDefault();


    /* =========================
       GET VALUES
    ========================= */

    const name =
        document
            .getElementById("name")
            .value
            .trim();


    const phone =
        document
            .getElementById("phone")
            .value
            .trim();


    const city =
        document
            .getElementById("city")
            .value
            .trim();


    const address =
        document
            .getElementById("address")
            .value
            .trim();


    const sizeElement =
        document.querySelector(
            'input[name="size"]:checked'
        );


    const colorElement =
        document.querySelector(
            'input[name="color"]:checked'
        );


    const size =
        sizeElement
            ? sizeElement.value
            : "";


    const color =
        colorElement
            ? colorElement.value
            : "";


    /* =========================
       BASIC VALIDATION
    ========================= */

    if (!name) {

        alert("عافاك دخل الاسم الكامل.");

        return;
    }


    if (!isValidMoroccanPhone(phone)) {

        alert(
            "عافاك دخل رقم هاتف مغربي صحيح، مثال: 0612345678"
        );

        return;
    }


    if (!city) {

        alert("عافاك دخل المدينة.");

        return;
    }


    if (!address) {

        alert("عافاك دخل العنوان بالتفصيل.");

        return;
    }


    if (!size) {

        alert("عافاك اختار المقاس.");

        return;
    }


    if (!color) {

        alert("عافاك اختار اللون.");

        return;
    }


    /* =========================
       PREPARE DATA
    ========================= */

    const data = {

        name: name,

        phone: phone,

        city: city,

        address: address,

        size: size,

        color: color

    };


    /* =========================
       LOADING
    ========================= */

    setLoading(true);


    try {

        /*
         * إرسال البيانات إلى Google Apps Script
         *
         * no-cors مهم لأن الصفحة موجودة
         * على GitHub Pages
         */

        await fetch(
            SCRIPT_URL,
            {
                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify(data)
            }
        );


        /*
         * Google Apps Script استقبل الطلب.
         */

        form.reset();


        /*
         * إعادة اللون الافتراضي
         */

        const defaultColor =
            document.querySelector(
                'input[name="color"][value="أسود كامل"]'
            );

        if (defaultColor) {
            defaultColor.checked = true;
        }


        /*
         * إعادة المقاس
         */

        document
            .querySelectorAll(
                'input[name="size"]'
            )
            .forEach((input) => {

                input.checked = false;

            });


        /*
         * إظهار رسالة النجاح
         */

        showSuccess();


    } catch (error) {

        console.error(
            "Order Error:",
            error
        );


        alert(
            "وقع مشكل بسيط فإرسال الطلب. عافاك حاول مرة أخرى."
        );

    } finally {

        setLoading(false);

    }

});


/* =========================================
   PHONE INPUT
========================================= */

const phoneInput =
    document.getElementById("phone");


phoneInput.addEventListener(
    "input",
    function() {

        this.value =
            this.value.replace(
                /[^0-9+]/g,
                ""
            );

    }
);


/* =========================================
   CLOSE SUCCESS WITH ESCAPE
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            !successMessage.classList.contains("hidden")
        ) {

            closeSuccess();

        }

    }
);
