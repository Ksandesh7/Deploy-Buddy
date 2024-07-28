import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaGithub } from "react-icons/fa";
import { io } from 'socket.io-client';

const socket = io("http://localhost:9001");

function App() {
    const [repoURL, setURL] = useState("");

    // const myList = ["List item 1", "List item 2", "List item 3", "List item 4", "List item 5"];
    const [logs, setLogs] = useState([]);

    const [loading, setLoading] = useState(false);

    const [projectId, setProjectId] = useState(undefined);

    const [deployPreviewUrl, setDeployPreviewUrl] = useState()

    const logContainerRef = useRef(null);

    const isValidURL = useMemo(()=>{
      if(!repoURL || repoURL.trim()==="") return [false, null];
      const regex = new RegExp(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\/)?$/);
      return [regex.test(repoURL), "Enter Valid Github Repository Url"];
    }, [repoURL]);

    const handleClickDeploy = useCallback(async()=>{
        setLoading(true);
        console.log('repoURL: ', repoURL)
        console.log('projectId: ', projectId)
        const {data} = await axios.post(`http://localhost:9000/project`, {
          gitURL: repoURL,
          slug: projectId,
        })

        console.log("data : ", data);

        if(data && data.data) {
          const {projectSlug, url} = data.data;
          setProjectId(projectSlug);
          setDeployPreviewUrl(url);

          console.log(`Subscribing to Logs: ${projectSlug}`)
          socket.emit("subscribe", `logs:${projectSlug}`);

        }
    }, [projectId, repoURL]);

    const handleSocketIncomingMessage = useCallback((message) => {
      console.log(`[Incoming Socket Message]:`, typeof message, message);
    
      try {
        // If message is not already valid JSON, transform it into a valid JSON string
        let validJSONMessage = message;
    
        // Check if the message is not a valid JSON string
        try {
          JSON.parse(message);
        } catch (e) {
          // If JSON.parse fails, assume it's a plain string and convert it
          validJSONMessage = JSON.stringify({ log: message });
        }
    
        const { log } = JSON.parse(validJSONMessage);
        setLogs((prev) => [...prev, log]);
    
        logContainerRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.error("Failed to parse message:", message, error);
      }
    }, []);
    

    useEffect(()=>{
      socket.on("message", handleSocketIncomingMessage);

      return ()=>{
        socket.off("message", handleSocketIncomingMessage);
      };
    },[handleSocketIncomingMessage]);

    return (
      <div className="flex justify-center pt-[10%] h-[100vh] bg-slate-900">
          <div className='w-[90vw]'>
            <span className="flex justify-center items-center gap-2 ">
              <div className='bg-white rounded-3xl'>
                <FaGithub className="text-5xl border border-2 rounded-3xl"/></div>
              <input disabled={loading} value={repoURL} onChange={(e)=>setURL(e.target.value)} type="url" placeholder="Github URL" className='w-[500px] h-[40px] p-2 rounded-lg'/>
            
              <button onClick={handleClickDeploy} disabled={!isValidURL[0]} className='text-white w-fit bg-gray-800 py-2 px-4 rounded-md border '>
              {loading? "In Progress" : "Deploy"}
            </button>
            </span>
            

            {deployPreviewUrl && (
              <div className='mx-auto w-fit mt-10 text-white py-4 px-2 rounded-lg'>
                <p>
                  Preview URL{" : "}
                  <a rel="noreferrer" href={deployPreviewUrl} target='_blank' className='text-sky-400 bg-sky-950 px-3 py-2 rounded-lg'>  {deployPreviewUrl}
                  </a>
                </p>
              </div>
            )}


            {logs.length>0 && (
              <div className={`w-[60%] mx-auto text-sm text-green-500 logs-container mt-5 border-green-500 border-2 rounded-lg p-4 h-[300px] overflow-y-auto`}>
                <pre className="flex flex-col gap-1">
                  {logs.map((log, index)=>{
                    return (
                      <code ref={logs.length - 1 === index ? logContainerRef : undefined} key={index}>
                        {`> ${log}`}
                      </code>
                    )
                  })}
                </pre>
              </div>
            )}
          </div>
      </div>
    );
}

export default App;
