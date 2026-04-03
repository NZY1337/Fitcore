import {
    EditableProjectProps,
    type ProjectApiProps
} from "./index";

interface BuilderOptionsProps {
    builderState: EditableProjectProps;
    charCount: number;
    setBuilderState: React.Dispatch<React.SetStateAction<EditableProjectProps>>;
    handleGenerateBaseDesign: () => void;
    onHandleSubmit: (stateBuilder: EditableProjectProps) => void;
    handlePromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export type SubmitBuilderProps = Pick<ProjectApiProps, "n" | "prompt" | "size" | "output_format" | "images" | "quality" | "category">

export type QualityAndSizeBuilderProps = Omit<BuilderOptionsProps, 'isLoading', 'onHandleSubmit'>;
export type SpaceTypesBuilderProps = QualityAndSizeBuilderProps;
export type DesignThemesBuilderProps = QualityAndSizeBuilderProps;
export type CategoriesBuilderProps = QualityAndSizeBuilderProps;
export type FileUploadProps = QualityAndSizeBuilderProps