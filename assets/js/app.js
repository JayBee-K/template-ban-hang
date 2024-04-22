var windowWidth = document.documentElement.clientWidth;
window.addEventListener("resize", () => {
	windowWidth = document.documentElement.clientWidth;
});

let handleApplyCollapse = function ($parent, $firstItem = false, $callFunction = false) {
	let $childUl = $parent.find('> li > ul');
	if ($childUl.length === 0) {
		return;
	}

	if ($callFunction) {
		$parent.find('> li a').each(function () {
			$(this).attr('data-href', $(this).attr('href'))
		});
	}

	if (windowWidth <= 991) {

		let $objParentAttr = {};
		let $objChildrenAttr = {
			'data-bs-parent': '#' + $parent.attr('id')
		}

		if ($firstItem) {
			let $parentID = 'menu-' + Math.random().toString(36).substring(7);
			$parent.attr('id', $parentID);
			$objParentAttr = {
				'data-bs-parent': '#' + $parentID
			}

			$objChildrenAttr = {};
		}

		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');
			let $parentListItemAnchor = $parentListItem.children('a');

			let $parentUlID = 'menu-' + Math.random().toString(36).substring(7);

			$parentUl.addClass('collapse').attr({
				'id': 'collapse-' + $parentUlID, ...$objParentAttr, ...$objChildrenAttr
			});

			$parentListItemAnchor.replaceWith(function () {
				return `<button aria-label="${$parentListItemAnchor.attr('aria-label')}" data-href="${$parentListItemAnchor.attr('data-href')}" data-bs-toggle="collapse" data-bs-target="#${$parentUl.attr('id')}">${$parentListItemAnchor.html()}</button>`
			})

			handleApplyCollapse($parentUl, false);

			$parentUl.on('show.bs.collapse', function () {
				$parent.find('.collapse.show').not($parentUl).collapse('hide');
			});
		});
	} else {
		$parent.removeAttr('id');

		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');

			$parentUl.removeClass('collapse').removeAttr('data-bs-parent id');
			$parentListItem.children('a').attr('href', $parentListItem.children('a').attr('data-href'));

			$parentListItem.children('button').replaceWith(function () {
				return `<a aria-label="${$(this).attr('aria-label')}" href="${$(this).attr('data-href')}" data-href="${$(this).attr('data-href')}">${$(this).html()}</a>`
			})

			handleApplyCollapse($parentUl);
		});
	}
}

let handleCallMenu = function () {
	const $body = $('body');
	const handleBody = function ($toggle = false) {
		if ($body.hasClass('is-navigation')) {
			$body.removeClass('is-navigation');
			if ($body.hasClass('is-overflow')) {
				$body.removeClass('is-overflow');
			}

			$('#header-navigation ul').collapse('hide');
		} else {
			if ($toggle) {
				$body.addClass('is-navigation is-overflow')
			}
		}
	}

	if (windowWidth <= 991) {
		const $hamburger = $('#hamburger-button');
		if ($hamburger.length) {
			$hamburger.click(function () {
				handleBody(true)
			});
		}

		const $overlay = $('#header-overlay');
		if ($overlay.length) {
			$overlay.click(function () {
				handleBody();
			});
		}
	} else {
		handleBody();
	}
}

const handleStickHeader = function () {
	$(window).scroll(function (e) {
		if ($(document).scrollTop() > $('#header').innerHeight()) {
			$('#header').addClass('is-scroll');
		} else {
			$('#header').removeClass('is-scroll');
		}
	});
}

const handleCart = function () {
	const floatingCart = $('#floatingCart');

	if (floatingCart.length) {
		/***
		 * Xử lý đóng mở giỏ hàng
		 * Xử lý render html product trong giỏ hàng
		 */
		const handleToggleCart = function (hasProduct = false) {
			const btnCall = $('#callCart');
			const btnCallMobile = $('#callCartMobile');
			const btnClose = $('#closeCart');
			const floatingOverlay = $('#floatingOverlay');
			const body = $('body');

			btnCall.add(btnCallMobile).click(function () {
				body.addClass('is-cart');
			});

			btnClose.add(floatingOverlay).click(function () {
				body.removeClass('is-cart');
			});

			if (hasProduct == true) {
				const htmlProduct = `<div class="card-item align-items-start gap-10px hstack">
                            <div class="card-image flex-shrink-0">
                                <a href="" class="d-inline-flex align-middle ratio ratio-16x9">
                                    <img src="./assets/images/course/course-1.webp"
                                         class="w-100 img-fluid transition-default" alt="">
                                </a>
                            </div>
                            <div class="card-content flex-fill">
                                <a href="" class="card-title limit">
                                    Lớp Tiếng Anh 11-12 chất lượng Việt Nam
                                </a>
                                <div class="hstack gap-8px justify-content-between">
                                    <div class="card-quantity w-50 flex-fill">
                                        <div class="card-text">
                                            Số lượng
                                        </div>
                                        <div class="card-group hstack flex-nowrap quantityGroup">
                                            <button disabled
                                                    class="link-default hstack justify-content-center flex-shrink-0 card-quantity_btn quantityButton" data-type="0">
                                                <i class="fal fa-minus"></i>
                                            </button>
                                            <input type="text" class="form-control card-quantity_input quantityInput" value="1">
                                            <button class="link-default hstack justify-content-center flex-shrink-0 card-quantity_btn quantityButton" data-type="1">
                                                <i class="fal fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="card-desc w-50 flex-fill text-end">
                                        <div class="card-price">
                                            6.950.000₫
                                        </div>
                                        <div class="card-clear">
                                            <button class="link-default buttonDelete">Xóa</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
				const listProduct = $('#cardList');

				listProduct.append(htmlProduct)

				body.addClass('is-cart');
				floatingCart.addClass('is-product');
				handleDeleteProductCart();
			}
		}

		/***
		 * Xử lý nút thêm sản phẩm vào giỏ hàng
		 */
		const handleAddProductCart = function () {
			const buttonAdds = $('.buttonCart');
			if (buttonAdds.length) {
				buttonAdds.click(function () {
					handleToggleCart(true);
				})
			}
		}


		/***
		 * Xử lý nút xóa sản phẩm khỏi giỏ hàng
		 */
		const handleDeleteProductCart = function () {
			const buttonDeletes = $('.buttonDelete');
			buttonDeletes.click(function () {
				const buttonDelete = $(this);
				const itemProduct = buttonDelete.closest('.card-item');
				itemProduct.fadeOut(function () {
					itemProduct.remove();

					if (floatingCart.find('#cardList .card-item').length === 0) {
						floatingCart.removeClass('is-product');
					}
				});
			})
		}

		const handleQuantityProduct = function () {
			$(document).on('click', '.quantityButton', function (e) {
				e.stopPropagation();

				let type = parseInt($(this).attr('data-type')),
					quantityGroup = $(this).closest('.quantityGroup'),
					quantityInput = quantityGroup.find('.quantityInput'),
					quantityValue = parseInt(quantityInput.val());

				if (!isNaN(type)) {
					if (type === 1) {
						quantityValue += 1;
						if (quantityValue > 1) {
							quantityGroup.find('.quantityButton[data-type=0]').removeAttr('disabled');
						}
					} else if (type === 0 && quantityValue > 1) {
						quantityValue -= 1;
						if (quantityValue === 1) {
							quantityGroup.find('.quantityButton[data-type=0]').attr('disabled', 1);
						}
					}
				}

				quantityInput.val(quantityValue);
			})
		}

		/***
		 * Gọi function
		 */
		handleToggleCart();
		handleAddProductCart();
		handleQuantityProduct();
	}
}

const handleCopyValue = function () {
	const copyButtons = document.querySelectorAll('.button-copy');
	if (copyButtons) {
		copyButtons.forEach(function (copyButton) {
			if (copyButton.getAttribute('data-bs-toggle') === 'tooltip') {
				new bootstrap.Tooltip(copyButton)
			}

			copyButton.addEventListener('click', function () {
				const valueToCopy = copyButton.getAttribute('data-value');

				const tempTextArea = document.createElement('textarea');
				tempTextArea.style.cssText = 'position: absolute; left: -99999px';
				tempTextArea.setAttribute("id", "textareaCopy");
				document.body.appendChild(tempTextArea);

				let textareaElm = document.getElementById('textareaCopy');
				textareaElm.value = valueToCopy;
				textareaElm.select();
				textareaElm.setSelectionRange(0, 99999);
				document.execCommand('copy');

				document.body.removeChild(textareaElm);

				if (copyButton.getAttribute('data-bs-toggle') === 'tooltip') {
					copyButton.setAttribute('title', 'Đã sao chéo');

					const tooltip = bootstrap.Tooltip.getInstance(copyButton);
					tooltip.setContent({'.tooltip-inner': 'Đã sao chéo'})
				}
			});
		})
	}
}

const handleInitFancybox = function () {
	if ($('.initFancybox').length) {
		$('.initFancybox').each(function () {
			let elm = $(this);
			Fancybox.bind(`[data-fancybox=${elm.attr('data-fancybox')}]`, {
				thumbs: {
					autoStart: true,
				},
			});
		});
	}
}
const handleContentDetail = () => {
	if ($('#detailContent').length > 0) {
		if ($('#detailContent img').length > 0) {
			$('#detailContent img').each((index, elm) => {
				$(elm).wrap(`<a style="cursor: zoom-in" href="${$(elm).attr('src')}" data-caption="${$(elm).attr('alt')}" data-fancybox="images-detail"></a>`);
			});

			Fancybox.bind('[data-fancybox]', {
				thumbs: {
					autoStart: true,
				},
			});
		}

		if ($('#detailContent table').length > 0) {
			$('#detailContent table').map(function () {
				$(this).addClass('table table-bordered');
				$(this).wrap('<div class="table-responsive"></div>');
			})
		}
	}
}

$(function () {
	handleApplyCollapse($('#header-navigation > ul'), true, true);
	handleCallMenu();
	$(window).resize(function () {
		handleApplyCollapse($('#header-navigation > ul'));
		handleCallMenu();
	})

	handleStickHeader();
	handleCart();

	handleCopyValue();
	handleInitFancybox();

	handleContentDetail();

	if ($('#slider-hero').length) {
		new Swiper('#slider-hero .swiper', {
			speed: 500,
			autoplay: {
				delay: 8000,
				disableOnInteraction: true,
			},
			loop: true,
			slidesPerView: 1,
			pagination: {
				el: '#slider-hero .slider-pagination',
				type: 'bullets',
				bulletClass: 'slider-pagination_item',
				clickable: true,
			},
			navigation: {
				nextEl: "#slider-hero .slider-navigation .slider-navigation_next",
				prevEl: "#slider-hero .slider-navigation .slider-navigation_prev",
			},
		});
	}

	if ($('#slider-articles').length) {
		new Swiper('#slider-articles .swiper', {
			speed: 500,
			spaceBetween: 15,
			autoplay: {
				delay: 8000,
				disableOnInteraction: true,
			},
			loop: false,
			slidesPerView: 3,
			breakpoints: {
				1199: {
					slidesPerView: 3,
				},
				567: {
					loopedSlides: 2.3,
				},
				320: {
					slidesPerView: 1.3,
				}
			},
			navigation: {
				nextEl: "#slider-articles .slider-navigation .slider-navigation_next",
				prevEl: "#slider-articles .slider-navigation .slider-navigation_prev",
			},
		});
	}

	if ($('#slider-partner').length) {
		new Swiper('#slider-partner .swiper', {
			speed: 500,
			spaceBetween: 15,
			autoplay: {
				delay: 8000,
				disableOnInteraction: true,
			},
			loop: false,
			slidesPerView: 4,
			breakpoints: {
				1199: {
					slidesPerView: 4,
				},
				767: {
					loopedSlides: 3.3,
				},
				320: {
					slidesPerView: 2.5,
				}
			},
			navigation: {
				nextEl: "#slider-partner .slider-navigation .slider-navigation_next",
				prevEl: "#slider-partner .slider-navigation .slider-navigation_prev",
			},
		});
	}

	if ($('#slider-featured').length) {
		new Swiper('#slider-featured .swiper', {
			effect: "coverflow",
			loop: !0,
			grabCursor: !0,
			direction: "horizontal",
			centeredSlides: !0,
			speed: 800,
			slidesPerView: 'auto',
			loopedSlides: 4,
			coverflowEffect: {
				rotate: 50,
				stretch: 0,
				depth: 1e3,
				modifier: 1,
				slideShadows: !0
			},
			breakpoints: {
				991: {
					slidesPerView: 'auto',
				},
				768: {
					loopedSlides: 4,
				},
				320: {
					slidesPerView: 1,
				}
			},
			pagination: {
				el: '#slider-featured .slider-pagination',
				type: 'bullets',
				bulletClass: 'slider-pagination_item',
				clickable: true,
			}
		});
	}
});