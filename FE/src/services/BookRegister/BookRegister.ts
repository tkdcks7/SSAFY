import apiUploadAuth from '../../utils/apiUploadAuth'; // 새로운 업로드 Axios 인스턴스 사용

// 파일 업로드 함수
export const uploadBookFile = async (
  fileType: 'pdf' | 'epub',
  file: any,
  cover: any,
  metadata: { title: string; author: string; category: string },
  requestId: string
): Promise<any> => {
  const endpoint = `/registration/upload/${fileType}`;

  console.log('Endpoint:', endpoint);
  console.log('Request ID:', requestId);
  console.log('Metadata:', metadata);

  const formData = new FormData();
  formData.append('uploadFile', {
    uri: file.uri,
    type: file.type || 'application/pdf',
    name: file.name || 'upload.pdf',
  });
  formData.append('cover', {
    uri: cover.uri,
    type: cover.type || 'image/jpeg',
    name: cover.name || 'cover.jpg',
  });
  formData.append('metadata', JSON.stringify(metadata));

  // 전체 FormData를 문자열로 변환하여 출력
  let formDataSummary = 'FormData Summary:\n';
  formData._parts.forEach(([key, value]) => {
    formDataSummary += `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}\n`;
  });
  console.log(formDataSummary);

  try {
    const response = await apiUploadAuth.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Request-ID': requestId,
      },
    });

    console.log('Response Status:', response.status);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { code, message, errorMessage } = error.response.data;

      console.error(`Error Code: ${code}`);
      console.error(`Error Message: ${message}`);
      console.error(`Error Details: ${errorMessage}`);

      switch (code) {
        case 'G001':
          console.error('타입 혼합된 파일 전송 에러: EPUB, PDF, Image 혼합.');
          break;
        case 'G002':
          console.error('빈 파일 전송 에러: 업로드된 파일이 없습니다.');
          break;
        case 'X001':
          console.error('서버 내부 오류: 서버에 문제가 발생했습니다.');
          break;
        default:
          console.error('알 수 없는 오류 발생.');
      }
    } else {
      console.error('Upload Error:', error.message);
    }
    throw error;
  }
};

// 이미지 업로드 함수
export const uploadImageBook = async (
  images: { uri: string; type: string; name: string }[], // 이미지 여러 장
  cover: { uri: string; type: string; name: string },    // 커버 이미지
  metadata: { title: string; author: string; category: string }, // 메타데이터
  requestId: string // 채널명 (UUID)
): Promise<any> => {
  const endpoint = `/registration/upload/image`;

  console.log('Endpoint:', endpoint);
  console.log('Request ID:', requestId);
  console.log('Metadata:', metadata);

  const formData = new FormData();

  // 이미지 여러 장 추가
  images.forEach((image, index) => {
    formData.append(`uploadFile`, {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.name || `image_${index + 1}.jpg`,
    });
  });

  // 커버 이미지 추가
  formData.append('cover', {
    uri: cover.uri,
    type: cover.type || 'image/jpeg',
    name: cover.name || 'cover.jpg',
  });

  // 메타데이터 추가
  formData.append('metadata', JSON.stringify(metadata));

  // FormData 요약 출력
  let formDataSummary = 'FormData Summary:\n';
  formData._parts.forEach(([key, value]) => {
    formDataSummary += `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}\n`;
  });
  console.log(formDataSummary);

  try {
    const response = await apiUploadAuth.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Request-ID': requestId,
      },
    });

    console.log('Response Status:', response.status);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { code, message, errorMessage } = error.response.data;

      console.error(`Error Code: ${code}`);
      console.error(`Error Message: ${message}`);
      console.error(`Error Details: ${errorMessage}`);

      switch (code) {
        case 'G001':
          console.error('타입 혼합된 파일 전송 에러: EPUB, PDF, Image 혼합.');
          break;
        case 'G002':
          console.error('빈 파일 전송 에러: 업로드된 파일이 없습니다.');
          break;
        case 'X001':
          console.error('서버 내부 오류: 서버에 문제가 발생했습니다.');
          break;
        default:
          console.error('알 수 없는 오류 발생.');
      }
    } else {
      console.error('Upload Error:', error.message);
    }
    throw error;
  }
};