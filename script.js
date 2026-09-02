/* =====================================================
   SHEETDB API
   
   তোমার দেওয়া API এখানে ইতোমধ্যে বসানো হয়েছে।
   আর কিছু পরিবর্তন করার দরকার নেই।
===================================================== */

const SHEETDB_API_URL =
    "https://sheetdb.io/api/v1/ycszodeujuxqo";



/* =====================================================
   LANGUAGE SYSTEM
===================================================== */

let currentLanguage = "bn";


function toggleLanguage() {

    currentLanguage =
        currentLanguage === "bn"
        ? "en"
        : "bn";


    document
        .querySelectorAll(".lang-bn")
        .forEach(element => {

            element.style.display =
                currentLanguage === "bn"
                ? "inline"
                : "none";

        });


    document
        .querySelectorAll(".lang-en")
        .forEach(element => {

            element.style.display =
                currentLanguage === "en"
                ? "inline"
                : "none";

        });


    document.getElementById(
        "languageButton"
    ).textContent =
        currentLanguage === "bn"
        ? "English"
        : "বাংলা";


    /* Change input placeholders */

    document.getElementById(
        "name"
    ).placeholder =
        currentLanguage === "bn"
        ? "আপনার নাম লিখুন"
        : "Enter your name";


    document.getElementById(
        "wish"
    ).placeholder =
        currentLanguage === "bn"
        ? "আপনার অপূর্ণ ইচ্ছেটা এখানে লিখুন..."
        : "Write your unfinished wish here...";

}



/* =====================================================
   CHARACTER COUNTER
===================================================== */

const wishInput =
    document.getElementById("wish");

const charCount =
    document.getElementById("charCount");


wishInput.addEventListener(
    "input",
    function() {

        charCount.textContent =
            this.value.length +
            " / 500";

    }
);



/* =====================================================
   FORM SUBMISSION
===================================================== */

const form =
    document.getElementById("wishForm");

const submitButton =
    document.getElementById(
        "submitButton"
    );

const buttonText =
    document.getElementById(
        "buttonText"
    );

const successMessage =
    document.getElementById(
        "successMessage"
    );

const errorMessage =
    document.getElementById(
        "errorMessage"
    );


form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        /* Hide old messages */

        successMessage.style.display =
            "none";

        errorMessage.style.display =
            "none";


        /* Disable submit button */

        submitButton.disabled =
            true;


        buttonText.textContent =
            currentLanguage === "bn"
            ? "জমা হচ্ছে..."
            : "Submitting...";


        try {

            const response =
                await fetch(
                    SHEETDB_API_URL,
                    {
                        method: "POST",

                        body:
                            new FormData(form)
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "SheetDB request failed"
                );

            }


            const result =
                await response.json();


            console.log(
                "SheetDB:",
                result
            );


            /* SUCCESS */

            successMessage.style.display =
                "block";


            form.reset();


            charCount.textContent =
                "0 / 500";


            buttonText.textContent =
                currentLanguage === "bn"
                ? "✨ ইচ্ছেটা জমা দিন"
                : "✨ Submit my wish";


            setTimeout(
                function() {

                    successMessage.style.display =
                        "none";

                },
                5000
            );


        } catch (error) {

            console.error(
                "Error:",
                error
            );


            errorMessage.style.display =
                "block";


            buttonText.textContent =
                currentLanguage === "bn"
                ? "✨ ইচ্ছেটা জমা দিন"
                : "✨ Submit my wish";

        }


        submitButton.disabled =
            false;

    }
);



/* =====================================================
   LOAD OTHER PEOPLE'S WISHES
===================================================== */

async function loadWishes() {

    const container =
        document.getElementById(
            "wishesContainer"
        );


    container.innerHTML = `

        <div class="loading-text">

            ${
                currentLanguage === "bn"
                ? "✨ ইচ্ছেগুলো খোঁজা হচ্ছে..."
                : "✨ Loading wishes..."
            }

        </div>

    `;


    try {

        const response =
            await fetch(
                SHEETDB_API_URL
            );


        if (!response.ok) {

            throw new Error(
                "Could not load wishes"
            );

        }


        const data =
            await response.json();


        container.innerHTML = "";


        /* No data */

        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            container.innerHTML = `

                <div class="loading-text">

                    ${
                        currentLanguage === "bn"
                        ? "এখনও কোনো ইচ্ছে জমা হয়নি। প্রথম ইচ্ছেটা আপনার হতে পারে। ✨"
                        : "No wishes yet. Yours could be the first. ✨"
                    }

                </div>

            `;

            return;

        }


        /*
            শুধুমাত্র wish field নেওয়া হচ্ছে।
            name কখনো display করা হচ্ছে না।
            
            সর্বশেষ 12টি ইচ্ছে দেখাবে।
        */

        const wishes =
            data
                .filter(
                    item =>
                        item.wish &&
                        item.wish.trim() !== ""
                )
                .slice(-12)
                .reverse();


        if (wishes.length === 0) {

            container.innerHTML = `

                <div class="loading-text">

                    ${
                        currentLanguage === "bn"
                        ? "এখনও কোনো ইচ্ছে পাওয়া যায়নি।"
                        : "No wishes found."
                    }

                </div>

            `;

            return;

        }


        /* Create cards */

        wishes.forEach(
            (item, index) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "wish-card";


                /*
                    Security:
                    User-এর লেখা সরাসরি innerHTML-এ
                    দেওয়া হচ্ছে না।
                */

                const wishText =
                    document.createElement(
                        "div"
                    );


                wishText.className =
                    "wish-text";

                wishText.textContent =
                    item.wish;


                const icon =
                    document.createElement(
                        "div"
                    );


                icon.className =
                    "wish-icon";

                icon.textContent =
                    "✨";


                const number =
                    document.createElement(
                        "div"
                    );


                number.className =
                    "wish-number";

                number.textContent =
                    currentLanguage === "bn"
                    ? "একটি অজানা ইচ্ছে • #" +
                      (index + 1)
                    : "An anonymous wish • #" +
                      (index + 1);


                card.appendChild(icon);

                card.appendChild(wishText);

                card.appendChild(number);


                container.appendChild(
                    card
                );

            }
        );


        /* Scroll to wishes */

        document
            .getElementById("wishes")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


    } catch (error) {

        console.error(
            "Loading error:",
            error
        );


        container.innerHTML = `

            <div class="loading-text">

                ${
                    currentLanguage === "bn"
                    ? "❌ ইচ্ছেগুলো লোড করা যায়নি। আবার চেষ্টা করুন।"
                    : "❌ Could not load wishes. Please try again."
                }

            </div>

        `;

    }

}
