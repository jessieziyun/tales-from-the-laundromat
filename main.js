function hideLandingPage() {
    $(document).ready(() => {
        $('.logo').click(
            () => {
                $('.entry').css({
                    "display": "none"
                });
            },
        );
    });
}

hideLandingPage();