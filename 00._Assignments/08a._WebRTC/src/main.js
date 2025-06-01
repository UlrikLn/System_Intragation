import './style.css';


let localStream;        // Holds the local webcam stream
let remoteStream;       // Holds the incoming remote video stream
let peerConnection;     // RTCPeerConnection instance for WebRTC

// STUN server helps discover public IP addresses (for NAT traversal)
const servers = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    }
  ]
};

async function init(){
  // Request access to the webcam (video only) and set it to the local video element
  localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
  document.getElementById("localVideo").srcObject = localStream;
}

// Create a new WebRTC peer connection and set up tracks + event listeners
async function createPeerConnection(sdpOfferTextAreaId){
  peerConnection = new RTCPeerConnection();

  // Prepare remote media stream to display incoming tracks
  remoteStream = new MediaStream();
  document.getElementById("remoteVideo").srcObject = remoteStream;

  // Add local tracks (webcam video) to the peer connection
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
  
  // When remote tracks arrive, add them to the remote stream
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
  };

  // When ICE candidates (connection info) are ready, update the SDP offer/answer textarea
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      document.getElementById(sdpOfferTextAreaId).textContent = JSON.stringify(peerConnection.localDescription)
    }
  };

}

// Create an SDP offer to initiate a connection
async function createOffer(){
  if(!localStream){
    return alert("Local stream is not ready");
  }

  // Set up the peer connection and get local tracks ready
  const offer = await createPeerConnection("sdpOfferTextArea");

  // tells WebRTC that a peer wants to start a connection which triggers the ICE candidate gathering for itself
  await peerConnection.setLocalDescription(offer);

}

// Create an SDP answer in response to an offer
async function createAnswer() {
  await createPeerConnection("sdpAnswerTextArea");

  // Get the offer text from the textarea and parse it
  let offer = document.getElementById("sdpOfferTextArea").value;
  if (!offer) return alert("Offer is required")
  offer = JSON.parse(offer);

  // Apply the remote offer to the peer connection
  await peerConnection.setRemoteDescription(offer);

  // Create an answer and set it as the local description
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  // Write the answer to the textarea so it can be shared
  document.getElementById("sdpAnswerTextArea").textContent = JSON.stringify(answer);
}

// Add the remote answer to complete the connection
async function addAnswer(){
  let answer = document.getElementById("sdpAnswerTextArea");
  if (!answer) return alert("Answer is recuired");
  answer = JSON.parse(answer.value);

  // If the peer connection already has a remote description, we don't need to set it again
  if (!peerConnection.currentRemoteDescription) {
    peerConnection.setRemoteDescription(answer);
  }
}

// Start the local video stream when the page loads
init();
document.getElementById("createOfferButton").addEventListener("click", createOffer);
document.getElementById("createAnswerButton").addEventListener("click", createAnswer);
document.getElementById("addAnswerButton").addEventListener("click", addAnswer);

