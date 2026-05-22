import { useEffect, useState } from "react";
import { getStockAgeingReport } from "../services/auth.service";

// 🔥 selectedOrg ko parameter mein add kiya
export default function useStockAgeing(fromDate, toDate, trigger, selectedOrg) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 🔥 Control: Agar selectedOrg nahi hai ya button click nahi hua
    if (!selectedOrg || trigger === 0) return;

    const load = async () => {
      try {
        setLoading(true);
        // API ko selectedOrg (CSA_ID) bhej rahe hain
        const res = await getStockAgeingReport(fromDate, toDate, selectedOrg);

        if (res?.status === "ok") {
          setData(res.data || []);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Stock ageing error", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
    // 🔄 selectedOrg dependency mein hai, toh CSA change hote hi ye chalege
  }, [fromDate, toDate, trigger, selectedOrg]); 

  return { data, loading };
}