from django_redis import get_redis_connection
import javaobj
import logging
from .mysql_util import MysqlUtil
from main.models import Member
import base64

def get_member_id(request) -> int:
    # 세션 ID 받기
    encoded_session_id = request.COOKIES.get('JSESSIONID')
    session_id = base64.b64decode(encoded_session_id).decode('utf-8')
    if not session_id:
        return None

    # 세션 데이터 가져오기
    conn = get_redis_connection("default") # default: 세팅 CACHES에서 설정한 별칭
    session_key = f"spring:session:sessions:{session_id}"
    try:
        serialized_member_id = conn.hget(session_key, 'sessionAttr:memberId')
        if serialized_member_id is None:
            return None

        member_id_obj = javaobj.loads(serialized_member_id)
        if hasattr(member_id_obj, "value"):
            return member_id_obj.value
        else:
            return None
    except Exception as e:
        logging.error(str(e))
        return None
        

def verify_member(request) -> Member:
    member_id = get_member_id(request)
    if member_id is None:
        return None
    
    try:
        member = MysqlUtil().find_member_by_member_id(member_id)
        return member
    except Exception as e:
        logging.error(f'멤버 인증 과정에서 문제 발생 {str(e)}')
        return None
    