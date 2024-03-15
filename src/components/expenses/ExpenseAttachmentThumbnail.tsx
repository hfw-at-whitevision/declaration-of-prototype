import {Item} from "react-photoswipe-gallery";
import 'photoswipe/dist/photoswipe.css';

const ExpenseAttachmentThumbnail = ({imageUrl}) => {
    const screenHeight = window?.innerHeight;
    const screenWidth = window?.innerWidth;

    const height = screenHeight * 0.8;
    const width = screenWidth * 0.8;

    return (
        <Item
            original={imageUrl}
            thumbnail={imageUrl}
        >
            {({ ref, open }) => (
                <img ref={ref} onClick={open} src={imageUrl} className="w-full max-w-[200px] h-[100px] p-2 object-contain rounded-md border-2 border-amber-400 cursor-pointer" />
            )}
        </Item>
    );
}

export default ExpenseAttachmentThumbnail;
