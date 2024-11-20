export const injectedScrpt = `
let nowIndex = 0;
window.ReactNativeWebView.postMessage(JSON.stringify({ msgg: "시작" }));

const handlePageMove = async (cfisRange) => {
  const currentLoc = await rendition.currentLocation();
  const currentLocEnd = currentLoc.end.cfi;
  const vallnum = rendition.epubcfi.compare(cfisRange, currentLocEnd);
  if (vallnum > -1) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ gonextpage: 1 }));
  }
};

const currentPageFirstIndex = async (startCfi, arr) => {
  const arrParse = JSON.parse(arr);
  rendition.epubcfi.compare(startCfi, formItem.cfisRange);
  const updateIdx = arrParse.findIndex((formItem) => {
    const vall = rendition.epubcfi.compare(startCfi, formItem.cfisRange);
    return vall < 1;
  });
  window.ReactNativeWebView.postMessage(JSON.stringify({ updateIdx }));
};

rendition.on("relocated", (location) => {
  const locPercentage = book.locations.percentageFromCfi(location.start.cfi);
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ reloc: locPercentage })
  );
  const currentLocIdx = location.start.index;
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      msgg: "리로케이트",
      prevIndex: nowIndex,
      currentLocIdx,
      stCfi: location.start.cfi,
      edCfi: location.end.cfi
    })
  );
  if (currentLocIdx !== nowIndex) {
    nowIndex = location.start.index;
    getFormArrForCustomBook();
  }
});

// getFormArrForCustomBook에서 Range를 생성하고 cfisRange를 계산하는 함수
const createCfiObject = (currentSection, sentence, element, isNode) => {
  const range = document.createRange();
  try {
    if (isNode) {
      range.selectNodeContents(element);
    } else {
      const startOffset = element.textContent.indexOf(sentence);
      const endOffset = startOffset + sentence.length;
      range.setStart(element.firstChild, startOffset);
      range.setEnd(element.firstChild, endOffset);
    }
    const cfisRange = currentSection.cfiFromRange(range);
    return { sentence, cfisRange };
  } catch (error) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ msgg: "에러남" }));
    return null;
  }
};

// 커스텀북의 태그별로 처리하여 formArr 생성해 전송하는 함수
const getFormArrForCustomBook = () => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ msgg: "챕터 파싱 시작" })
  );

  const formArr = [];
  const contentt = rendition.getContents();
  const contents = contentt[0];
  const currentView = rendition.manager.current();
  const currentSection = currentView.section;
  const elements = contents.document.querySelectorAll("img, h1, h2, h3, span");
  // 요소별 로직 처리
  for (const element of elements) {
    const tagName = element.tagName.toLowerCase();
    if (tagName === "img") {
      const sentence = element.alt;
      const tempObj = createCfiObject(currentSection, sentence, element, true);
      if (tempObj) formArr.push(tempObj);
    } else if (["h1", "h2", "h3", "span"].includes(tagName)) {
      const sentence = element.textContent;
      const tempObj = createCfiObject(currentSection, sentence, element, false);
      if (tempObj) formArr.push(tempObj);
    }
  }
  window.ReactNativeWebView.postMessage(JSON.stringify({ formArr }));
};
        `;
