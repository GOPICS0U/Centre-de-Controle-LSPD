document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = document.querySelectorAll('.dropdown > a');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default link behavior

            // Toggle active class on the dropdown
            const parentDropdown = this.parentElement;
            parentDropdown.classList.toggle('active');

            // Close other open dropdowns
            const otherDropdowns = document.querySelectorAll('.dropdown.active');
            otherDropdowns.forEach(otherDropdown => {
                if (otherDropdown !== parentDropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown')) {
            const activeDropdowns = document.querySelectorAll('.dropdown.active');
            activeDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});

document.addEventListener("scroll", () => {
    const elements = document.querySelectorAll(".fade-up");
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.classList.add("visible");
        }
    });
});

document.querySelectorAll('.count').forEach((count) => {
    const updateCount = () => {
        const target = +count.getAttribute('data-target');
        const current = +count.innerText;
        const increment = target / 200;

        if (current < target) {
            count.innerText = Math.ceil(current + increment);
            setTimeout(updateCount, 20);
        } else {
            count.innerText = target;
        }
    };
    updateCount();
});