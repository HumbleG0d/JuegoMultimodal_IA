import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
def update_conversation_stage(session, user_message):
    """Actualiza la etapa de la conversación basada en el contexto"""
    current_stage = session.get('stage', 'asking_name')

    if current_stage == 'asking_name' and not session.get('user_name'):
        # Si estamos en la etapa de nombre y aún no lo tenemos, guardarlo
        session['user_name'] = user_message
        session['stage'] = 'asking_query'
        logger.info(f"Nombre capturado: {user_message}")

    elif current_stage == 'asking_query':
        session['stage'] = 'providing_answer'

    elif current_stage == 'providing_answer':
        session['stage'] = 'asking_more_questions'

    elif current_stage == 'asking_more_questions':
        # Determinar si quiere más preguntas o terminar
        user_response = user_message.lower()
        if any(word in user_response for word in ['no', 'nada', 'terminar', 'salir', 'fin']):
            session['stage'] = 'ending_conversation'
        elif any(word in user_response for word in ['si', 'sí', 'yes', 'otra', 'más']):
            session['stage'] = 'asking_query'


def process_voiceflow_response(data, session_id):
    """Procesa la respuesta de Voiceflow"""
    messages = []
    conversation_ended = False
    response_type = "text"
    waiting_for_input = True

    for step in data:
        step_type = step.get('type')

        if step_type == 'text' or step_type == 'speak':
            message = step.get('payload', {}).get('message', '')
            if message:
                messages.append(message)

        elif step_type == 'choice':
            choices = step.get('payload', {}).get('buttons', [])
            if choices:
                response_type = "choice"
                choice_options = [choice.get('name', '') for choice in choices]
                messages.append("Por favor selecciona una opción:")
                messages.extend([f"• {option}" for option in choice_options])

        elif step_type == 'end':
            conversation_ended = True
            waiting_for_input = False
            if not messages:
                messages.append("¡Gracias por usar nuestra aplicación! ¡Hasta luego!")

    # Determinar el contexto de la respuesta
    full_message = " ".join(messages) if messages else ""
    context = determine_response_context(full_message, session_id)

    return {
        "type": "assistant",
        "message": full_message,
        "messages": messages,
        "response_type": response_type,
        "conversation_ended": conversation_ended,
        "waiting_for_input": waiting_for_input,
        "context": context,
        "timestamp": get_timestamp()
    }


def determine_response_context(message, session_id):
    """Determina el contexto de la respuesta para el frontend"""
    message_lower = message.lower()

    if any(phrase in message_lower for phrase in ['nombre', 'cómo te llamas', '¿cuál es tu nombre?']):
        return "asking_name"
    elif any(phrase in message_lower for phrase in ['qué deseas saber', 'qué necesitas', 'en qué puedo ayudarte']):
        return "asking_query"
    elif any(phrase in message_lower for phrase in ['otra consulta', 'algo más', 'más preguntas']):
        return "asking_more_questions"
    elif any(phrase in message_lower for phrase in ['gracias', 'hasta luego', 'adiós']):
        return "ending_conversation"
    else:
        return "providing_answer"


def get_timestamp():
    """Obtiene timestamp actual"""
    from datetime import datetime
    return datetime.now().isoformat()