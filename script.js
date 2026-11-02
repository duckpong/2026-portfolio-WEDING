// 웨딩 갤러리와 팝업, 계좌번호 복사 기능을 관리합니다.
document.addEventListener("DOMContentLoaded", () => {
  const galleryButtons = [...document.querySelectorAll(".gallery-item")];
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeButton = document.getElementById("lightboxClose");
  const prevButton = document.getElementById("prevPhoto");
  const nextButton = document.getElementById("nextPhoto");
  const photoPaths = galleryButtons.map(button => button.dataset.image);
  let currentPhoto = 0;

  // 선택한 사진을 확대 팝업에 표시합니다.
  function showPhoto(index) {
    currentPhoto = (index + photoPaths.length) % photoPaths.length;
    lightboxImage.src = photoPaths[currentPhoto];
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  // 팝업을 닫고 원래 페이지 스크롤을 복원합니다.
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  galleryButtons.forEach((button, index) => {
    button.addEventListener("click", () => showPhoto(index));
  });
  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", () => showPhoto(currentPhoto - 1));
  nextButton.addEventListener("click", () => showPhoto(currentPhoto + 1));

  // 사진 바깥 어두운 영역을 누르면 팝업을 닫습니다.
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });

  // 키보드의 ESC와 방향키도 지원합니다.
  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPhoto(currentPhoto - 1);
    if (event.key === "ArrowRight") showPhoto(currentPhoto + 1);
  });

  // 복사 성공 또는 실패 메시지를 작은 팝업으로 보여줍니다.
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  const toastClose = document.getElementById("toastClose");
  let toastTimer;

  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  toastClose.addEventListener("click", () => toast.classList.remove("show"));

  // 최신 브라우저의 Clipboard API를 우선 사용하고, 미지원 환경은 대체 방식을 사용합니다.
  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = value;
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    const copied = document.execCommand("copy");
    temporaryInput.remove();
    if (!copied) throw new Error("복사 실패");
  }

  document.querySelectorAll(".copy-button").forEach(button => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copy;
      const label = button.dataset.label || "내용";
      try {
        await copyText(value);
        showToast(`${label}가 복사되었습니다.`);
      } catch (error) {
        showToast("복사에 실패했습니다. 직접 선택해 주세요.");
      }
    });
  });

  // 이미지 로딩 오류를 콘솔에서 확인할 수 있도록 기록합니다.
  document.querySelectorAll("img").forEach(image => {
    image.addEventListener("error", () => {
      console.error("이미지를 불러오지 못했습니다:", image.src);
    });
  });
});
