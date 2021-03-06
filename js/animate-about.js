let enteringIndex = 0;
let leavingIndex = 2;
let elements = [];
let sectionIllustrations = []
const MIN_SCALING = 0.1;
const INITIAL_ROTATION = 240;
const SMALL_CIRCLE_CSS_VAR = "--small-circle-size";
const CIRCLE_CSS_VAR = "--circle-size";
const ANIMATION_SPEED = 250;


window.addEventListener("load", () => {
    elements = [...document.querySelectorAll(".about__item")];
    sectionIllustrations = [...document.querySelectorAll(".section-illustration")];
}, false);

function calcHypotenuse(a, b) {
    return (Math.sqrt((a * a) + (b * b)));
}

function updateElementsSizes() {
    const innerHeight = window.innerHeight;
    const innerWidth = window.innerWidth;
    const VERTICAL_OFFSET = 300;
    const heightLimits = innerHeight - VERTICAL_OFFSET;
    const largeScreen = window.innerWidth > 991;
    const screenPart = largeScreen ? 0.4 : 0.9;
    const widthLimits = innerWidth * screenPart;

    const circleSize = heightLimits > widthLimits || !largeScreen ? widthLimits : heightLimits;
    const smalleCircleSize = Math.round(circleSize / 4.5);
    let root = document.documentElement;
    root.style.setProperty(CIRCLE_CSS_VAR, `${circleSize}px`);
    root.style.setProperty(SMALL_CIRCLE_CSS_VAR, `${smalleCircleSize}px`);

    if (!largeScreen) {
        const r = circleSize / 2;
        const containerSize = calcHypotenuse(r, r);
        const top = $(".circle")[0].getBoundingClientRect().y + r - containerSize / 2;

        $(".about__item-inner").css({
            width: `${containerSize}px`,
            height: `${containerSize}px`,
            position: "sticky",
        });
    }
    
}

(function($){
    const $circle = $(".circle");
  
    // Calculate initial sizes
    updateElementsSizes()
    $(window).on("resize", () => updateElementsSizes());
    let oldAngle = 0;

    const rotateCircle = () => {
        const scrollTop = $(document).scrollTop();
        const sectionRatio = scrollTop / window.innerHeight;
        const initialRotation = window.innerWidth > 991 ? INITIAL_ROTATION : 330;
        const angle = sectionRatio * 120 + initialRotation;

        $({ angle: oldAngle }).animate({  angle: -angle }, {
            step: function(now,fx) {
                $circle.css('-webkit-transform',"rotate("+this.angle+'deg)'); 
                $circle.css('-moz-transform',"rotate("+this.angle+'deg)');
                $circle.css('transform',"rotate("+this.angle+'deg)');
            },
            duration: ANIMATION_SPEED,
            easing: 'linear'
        });
        oldAngle = -angle;
    }

    const setSize = (el, scaleIndex) => {
        const scaleString = `scale(${scaleIndex < MIN_SCALING ? MIN_SCALING : scaleIndex})`;
        $(el).css({
            "-webkit-transform": scaleString,
            "-moz-transform": scaleString,
            "transform": scaleString
        })
    }

    const fixIntroPostion = () => {
        const el = $(".about-intro__content");
        const offsetTop = el[0] && el[0].offsetTop;
        const width = el.width();
        setTimeout(() => {
            $(el).css("top", `${offsetTop}px`);
            $(el).css("width", `${width}px`);
            $(el).addClass("about-intro__content--fixed");
        });        
    }

    const releaseIntroPosition = () => {
        const el = $(".about-intro__content");
        if (el && $(el).hasClass("about-intro__content--fixed")) {
            $(el).css("top", "");
            $(el).css("width", "");
            $(el).removeClass("about-intro__content--fixed")
        }
    }

    function onScroll() {
        rotateCircle();

        const scrollTop = $(document).scrollTop();
        const sectionNumber = Math.floor(scrollTop / window.innerHeight);
        const remainder = scrollTop % window.innerHeight;


        if (sectionNumber === 0) {
            enteringIndex = 0;
            leavingIndex = 2;
        }
        if (sectionNumber === 1) {
            enteringIndex = 1;
            leavingIndex = 0;
        }
        if (sectionNumber === 2) {
            enteringIndex = 2;
            leavingIndex = 1;
        }
        if (sectionNumber === 3) {
            enteringIndex = 0;
            leavingIndex = 2;
        }

        if (sectionNumber > 1 && enteringIndex === 0) {
            fixIntroPostion()
        } else {
            releaseIntroPosition();
        }

        sectionIllustrations.forEach((el, i) => {
            if (i === leavingIndex) {
                const leavingSizeRation = (window.innerHeight - remainder) / window.innerHeight;
                setSize(el, leavingSizeRation)
                return;
            }
            if (i === enteringIndex) {
                const sizeRation = remainder / window.innerHeight;
                setSize(el, sizeRation);
                return
            }
            setSize(el, 0.001);
        })
        
    }

    function debounce(f, ms) {

        let isCooldown = false;
      
        return function() {
          if (isCooldown) return;
          isCooldown = true;
      
          setTimeout(() => {
              isCooldown = false
              f.apply(this, arguments);
          }, ms);
        };
    }

    const debouncedScrollHandler = debounce(onScroll, ANIMATION_SPEED);

    function animateSectionsEmerging() {
        var windowBottom = $(window).scrollTop() + $(window).innerHeight();
        elements.forEach(function(el, i) {
            var objectBottom = $(el).offset().top + $(el).outerHeight();
            const dif = (objectBottom - windowBottom) / $(window).innerHeight();
            if (i === 0) {
                console.log("objectBottom", objectBottom);
                console.log("windowBottom", windowBottom);
                console.log('dif', dif)
            }
            if (dif < 0.4 && dif > -0.06) {
                if ($(el).css("opacity")==0) {$(el).fadeTo(200,1);}
            } else {
                if ($(el).css("opacity")==1) {$(el).fadeTo(175,0);}
            }
        });
    }

    $(window).on("scroll", (e) => {
        animateSectionsEmerging();
        debouncedScrollHandler();
    });

})(jQuery);
