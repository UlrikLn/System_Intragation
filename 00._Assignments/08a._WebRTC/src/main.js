// Husk: kør med `npm run dev`, fordi det er et Vite-projekt
// Have sat deres egen localDescription.
// Have modtaget og sat modpartens remoteDescription.
import './style.css'; 

let localStream;        // Holds the local webcam stream
let remoteStream;       // Holds the incoming remote video stream
let peerConnection;     // RTCPeerConnection instance for WebRTC


// STUN server  hjælper med at finde IP-adresser bag NAT 
const servers = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    }
  ]
};

async function init(){
  // Start webcam og vis lokalt video
  localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
  document.getElementById("localVideo").srcObject = localStream;
}

async function createPeerConnection(sdpOfferTextAreaId){
  peerConnection = new RTCPeerConnection();

  remoteStream = new MediaStream();
  document.getElementById("remoteVideo").srcObject = remoteStream;

  // Tilføj lokal webcam stream til peer connection
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
  
  // når der modtages en ny track fra peer connection, tilføj den til remote stream
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
  };

  // Når der er en ICE-kandidat, skriv den til textarea
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      document.getElementById(sdpOfferTextAreaId).textContent = JSON.stringify(peerConnection.localDescription)
    }
  };

}

async function createOffer(){
  if(!localStream){
    return alert("Local stream is not ready");
  }
  
  // Start forbindelse og opret en offer
  const offer = await createPeerConnection("sdpOfferTextArea");
  await peerConnection.setLocalDescription(offer);

}


async function createAnswer() {
  await createPeerConnection("sdpAnswerTextArea");

   // Læs og brug modtaget offer
  let offer = document.getElementById("sdpOfferTextArea").value;
  if (!offer) return alert("Offer is required")
  offer = JSON.parse(offer);

  await peerConnection.setRemoteDescription(offer);

  // Generer et answer baseret på det modtagne offer
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  document.getElementById("sdpAnswerTextArea").textContent = JSON.stringify(answer);
}

// Tilføj modtaget svar (answer) for at fuldføre forbindelsen
async function addAnswer(){
  let answer = document.getElementById("sdpAnswerTextArea");
  if (!answer) return alert("Answer is recuired");
  answer = JSON.parse(answer.value);

  if (!peerConnection.currentRemoteDescription) {
    peerConnection.setRemoteDescription(answer);
  }
}

// Start the local video stream when the page loads
init();
document.getElementById("createOfferButton").addEventListener("click", createOffer);
document.getElementById("createAnswerButton").addEventListener("click", createAnswer);
document.getElementById("addAnswerButton").addEventListener("click", addAnswer);

