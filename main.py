import streamlit as st
from streamlit_gsheets import GSheetsConnection
import pandas as pd
from datetime import datetime

# 1. Configuración de página
st.set_page_config(
    page_title="ViggoFit - Elite Tracker",
    page_icon="🏋️‍♂️",
    layout="centered"
)

# 2. Estética Neon
st.markdown("""
    <style>
    .stApp { background-color: #000000; color: #ffffff; }
    h1, h2, h3 { color: #39FF14 !important; font-family: sans-serif; }
    .stButton>button { 
        background-color: #39FF14 !important; 
        color: black !important; 
        font-weight: bold !important; 
        border-radius: 10px !important; 
        width: 100%;
    }
    input { background-color: #111111 !important; color: white !important; }
    </style>
    """, unsafe_allow_html=True)

# 3. Inicialización de sesión
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False
if 'user_id' not in st.session_state:
    st.session_state.user_id = None

# 4. Conexión a Google Sheets
try:
    conn = st.connection("gsheets", type=GSheetsConnection)
except Exception:
    conn = None

# 5. Lógica de Login
if not st.session_state.logged_in:
    st.markdown("<h1 style='text-align: center;'>VIGGOFIT</h1>", unsafe_allow_html=True)
    st.markdown("<p style='text-align: center; color: #666;'>PERFORMANCE TRACKER</p>", unsafe_allow_html=True)
    
    with st.container():
        cedula = st.text_input("Cédula o ID de Atleta", placeholder="Ingresa tu identificación...")
        if st.button("ENTRAR AL BOX"):
            if len(cedula) >= 5:
                st.session_state.logged_in = True
                st.session_state.user_id = cedula
                st.rerun()
            else:
                st.error("ID inválido. Mínimo 5 caracteres.")
    st.stop()

# 6. Pantalla Principal
st.markdown(f"<h2>HOLA, ATLETA {st.session_state.user_id}</h2>", unsafe_allow_html=True)

if st.button("CERRAR SESIÓN"):
    st.session_state.logged_in = False
    st.session_state.user_id = None
    st.rerun()

st.info("¡Bienvenido a ViggoFit! La conexión está lista. Registra tu primer entrenamiento.")
