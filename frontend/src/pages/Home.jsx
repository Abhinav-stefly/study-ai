import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <>
      <Header />
      <div className="page-container" style={{textAlign:'center',paddingTop:40}}>
        <div className="card" style={{padding:30,maxWidth:800,margin:'0 auto'}}>
          <h1 style={{fontSize:36,marginBottom:8}}>Welcome to DocAI</h1>
          <p className="page-sub" style={{marginBottom:18}}>Upload documents, generate summaries, flashcards and practice with smart questions.</p>

          <div style={{display:'flex',justifyContent:'center',gap:12,marginTop:18}}>
            <Link to="/login" className="btn-primary">Login</Link>
            <Link to="/signup" className="btn-ghost">Sign up</Link>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginTop:22,alignItems:'center'}}>
            <div style={{textAlign:'center'}}>
              <img src="https://images.unsplash.com/photo-1581091012184-7d9b9a9b6d5f?q=80&w=600&auto=format&fit=crop" alt="upload" style={{width:'100%',height:110,objectFit:'cover',borderRadius:8}} />
              <div style={{marginTop:8,fontWeight:700}}>Upload documents</div>
              <div className="page-sub">Extract text from slides, scans and PDFs</div>
            </div>

            <div style={{textAlign:'center'}}>
              <img src="https://images.unsplash.com/photo-1553532077-1b8b50f6c1b1?q=80&w=600&auto=format&fit=crop" alt="summarize" style={{width:'100%',height:110,objectFit:'cover',borderRadius:8}} />
              <div style={{marginTop:8,fontWeight:700}}>Summarize content</div>
              <div className="page-sub">Get concise summaries for quick revision</div>
            </div>

            <div style={{textAlign:'center'}}>
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop" alt="study" style={{width:'100%',height:110,objectFit:'cover',borderRadius:8}} />
              <div style={{marginTop:8,fontWeight:700}}>Practice & Learn</div>
              <div className="page-sub">Flashcards, MCQs and long-form questions</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
