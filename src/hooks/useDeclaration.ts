import {getDeclaration} from "@/firebase";
import {useQuery} from "@tanstack/react-query";

export const useDeclaration = ({ declarationId }) => {
    return useQuery({
        queryKey: ["declaration", declarationId],
        queryFn: () => getDeclaration(declarationId),
    });
}
