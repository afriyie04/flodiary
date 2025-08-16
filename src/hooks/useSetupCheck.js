import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSetupCheck() {
  const router = useRouter();

  const checkForSetupRedirect = (cyclesData) => {
    // If user has no cycles, redirect to setup
    if (!cyclesData || cyclesData.length === 0) {
      toast.info("Please complete your cycle setup first");
      router.push("/cycle-setup");
      return true;
    }
    return false;
  };

  return { checkForSetupRedirect };
}