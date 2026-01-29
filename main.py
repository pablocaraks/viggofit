import streamlit as st\
from streamlit_gsheets import GSheetsConnection\
import pandas as pd\
from datetime import datetime\
\
# Configuraci\'f3n de p\'e1gina\
st.set_page_config(\
    page_title="ViggoFit - Elite Tracker",\
    page_icon="
\f1 \uc0\u55356 \u57291 \u65039 \u8205 \u9794 \u65039 
\f0 ",\
    layout="centered"\
)\
\
# Inyecci\'f3n de CSS para est\'e9tica Neon/Dark\
st.markdown("""\
    <style>\
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');\
    \
    .stApp \{\
        background-color: #000000;\
        color: #ffffff;\
    \}\
    \
    h1, h2, h3, .font-sporty \{\
        font-family: 'Orbitron', sans-serif !important;\
        color: #39FF14 !important;\
        text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);\
    \}\
    \
    .stButton>button \{\
        background-color: #39FF14 !important;\
        color: black !important;\
        font-family: 'Orbitron', sans-serif !important;\
        font-weight: bold !important;\
        border-radius: 10px !important;\
        border: none !important;\
        width: 100%;\
        transition: 0.3s;\
    \}\
    \
    .stButton>button:hover \{\
        box-shadow: 0 0 20px rgba(57, 255, 20, 0.8) !important;\
        transform: scale(1.02);\
    \}\
\
    .stTextInput>div>div>input, .stNumberInput>div>div>input, .stSelectbox>div>div>div \{\
        background-color: #111111 !important;\
        color: white !important;\
        border: 1px solid #333 !important;\
    \}\
\
    .stTextInput>div>div:focus-within \{\
        border-color: #39FF14 !important;\
    \}\
\
    .css-1offfwp e16nr0p33 \{\
        background-color: #111111 !important;\
    \}\
    \
    /* Estilo de tarjetas */\
    .workout-card \{\
        background-color: #111111;\
        border-left: 5px solid #39FF14;\
        padding: 15px;\
        border-radius: 8px;\
        margin-bottom: 10px;\
    \}\
    </style>\
    """, unsafe_allow_html=True)\
\
# Inicializaci\'f3n de sesi\'f3n\
if 'logged_in' not in st.session_state:\
    st.session_state.logged_in = False\
if 'user_id' not in st.session_state:\
    st.session_state.user_id = None\
\
# --- CONEXI\'d3N A GOOGLE SHEETS ---\
# Nota: Requiere configurar [connections.gsheets] en .streamlit/secrets.toml\
try:\
    conn = st.connection("gsheets", type=GSheetsConnection)\
except Exception:\
    conn = None\
\
def get_data():\
    if conn:\
        return conn.read(worksheet="Entrenamientos", ttl="0s")\
    return pd.DataFrame(columns=['C\'e9dula', 'Fecha', 'Peso_Corporal', 'Musculo', 'Ejercicio', 'Peso_Levantado'])\
\
# --- PANTALLA DE LOGIN ---\
if not st.session_state.logged_in:\
    st.markdown("<div style='text-align: center; margin-bottom: 2rem;'>", unsafe_allow_html=True)\
    # Placeholder para Logo\
    st.image("https://picsum.photos/200?random=1", width=120) \
    st.markdown("<h1>VIGGOFIT</h1><p style='color: #666; letter-spacing: 2px;'>PERFORMANCE TRACKER</p>", unsafe_allow_html=True)\
    st.markdown("</div>", unsafe_allow_html=True)\
\
    with st.container():\
        st.markdown("### ACCESO ATLETA")\
        cedula = st.text_input("C\'e9dula o ID de Atleta", placeholder="Ingresa tu identificaci\'f3n...")\
        if st.button("ENTRAR AL BOX"):\
            if len(cedula) >= 5:\
                st.session_state.logged_in = True\
                st.session_state.user_id = cedula\
                st.rerun()\
            else:\
                st.error("ID inv\'e1lido. M\'ednimo 5 caracteres.")\
    st.stop()\
\
# --- APP PRINCIPAL (LOGUEADO) ---\
user_id = st.session_state.user_id\
\
# Header\
col_h1, col_h2 = st.columns([3, 1])\
with col_h1:\
    st.markdown(f"<h2>HOLA, ATLETA \{user_id\}</h2>", unsafe_allow_html=True)\
with col_h2:\
    if st.button("SALIR"):\
        st.session_state.logged_in = False\
        st.session_state.user_id = None\
        st.rerun()\
\
# Cargar datos y filtrar estrictamente por usuario\
df_all = get_data()\
df_user = df_all[df_all['C\'e9dula'].astype(str) == str(user_id)]\
\
# Tabs: Registro y Progreso\
tab_reg, tab_prog = st.tabs(["
\f1 \uc0\u10133 
\f0  REGISTRO", "
\f1 \uc0\u55357 \u56520 
\f0  PROGRESO"])\
\
with tab_reg:\
    st.markdown("### NUEVO ENTRENAMIENTO")\
    with st.form("workout_form", clear_on_submit=True):\
        col1, col2 = st.columns(2)\
        with col1:\
            fecha = st.date_input("Fecha", datetime.now())\
            peso_corp = st.number_input("Peso Corporal (Kg)", min_value=30.0, max_value=250.0, step=0.1)\
        with col2:\
            musculo = st.selectbox("M\'fasculo", ["Pecho", "Espalda", "Pierna", "Hombros", "Brazos", "Core", "Full Body"])\
            ejercicio = st.text_input("Ejercicio", placeholder="Ej: Press Militar")\
        \
        peso_lev = st.number_input("Peso Levantado (Kg)", min_value=0.0, max_value=1000.0, step=0.5)\
        \
        submit = st.form_submit_button("GUARDAR REGISTRO")\
        \
        if submit:\
            if ejercicio:\
                new_data = pd.DataFrame([\{\
                    "C\'e9dula": user_id,\
                    "Fecha": fecha.strftime('%Y-%m-%d'),\
                    "Peso_Corporal": peso_corp,\
                    "Musculo": musculo,\
                    "Ejercicio": ejercicio,\
                    "Peso_Levantado": peso_lev\
                \}])\
                \
                # Aqu\'ed se a\'f1adir\'eda la l\'f3gica para escribir en GSheets\
                # updated_df = pd.concat([df_all, new_data], ignore_index=True)\
                # conn.update(worksheet="Entrenamientos", data=updated_df)\
                \
                st.success(f"\'a1Registro guardado! (Simulado: \{ejercicio\} @ \{peso_lev\}kg)")\
                # Nota: En un entorno real, descomentar las l\'edneas de actualizaci\'f3n de conn\
            else:\
                st.warning("Por favor escribe el nombre del ejercicio.")\
\
with tab_prog:\
    st.markdown("### TU EVOLUCI\'d3N")\
    \
    if not df_user.empty:\
        # Gr\'e1fica de peso corporal a lo largo del tiempo\
        df_user['Fecha'] = pd.to_datetime(df_user['Fecha'])\
        df_user = df_user.sort_values('Fecha')\
        \
        st.markdown("#### Peso Corporal (Kg)")\
        chart_data = df_user.groupby('Fecha')['Peso_Corporal'].mean()\
        st.line_chart(chart_data)\
        \
        st.markdown("#### Historial Reciente")\
        for index, row in df_user.tail(10).iloc[::-1].iterrows():\
            st.markdown(f"""\
                <div class="workout-card">\
                    <div style="display: flex; justify-content: space-between;">\
                        <span style="color: #666; font-size: 0.8rem;">\{row['Fecha'].strftime('%d/%m/%Y')\}</span>\
                        <span style="color: #39FF14; font-weight: bold;">\{row['Musculo']\}</span>\
                    </div>\
                    <div style="font-size: 1.1rem; margin-top: 5px;">\{row['Ejercicio']\}</div>\
                    <div style="font-family: 'Orbitron'; font-size: 1.5rem; text-align: right;">\{row['Peso_Levantado']\} KG</div>\
                </div>\
            """, unsafe_allow_html=True)\
    else:\
        st.info("No hay datos registrados para tu ID. \'a1Empieza hoy!")\
\
st.markdown("<br><hr><p style='text-align: center; color: #444; font-size: 0.7rem;'>VIGGOFIT INTELLIGENCE v2.0 | PRIVACY SECURED</p>", unsafe_allow_html=True)}
