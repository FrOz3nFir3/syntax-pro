import React from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import {
  addFolder,
  addPlayground,
  addPlaygroundAndFolder,
  editTitles,
} from "../../slices/playgroundSlice.jsx";
import {
  PlusIcon,
  XMarkIcon,
  FolderIcon,
  CodeBracketIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

const languageOptions = [
  { value: "javascript", label: "Javascript" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
];

// Custom Select classNames for Tailwind styling with dark mode support
const selectClassNames = {
  control: ({ isFocused }) =>
    `!bg-paper dark:!bg-ink-700 !border !border-ink/15 dark:!border-paper/15 !rounded-xl !px-3 !py-1.5 !min-h-[48px] !shadow-none ${
      isFocused
        ? "!border-ink dark:!border-paper !ring-2 !ring-mustard/40"
        : "hover:!border-ink/30 dark:hover:!border-paper/30"
    }`,
  option: ({ isSelected, isFocused }) =>
    `!py-3 !px-4 !cursor-pointer !text-sm ${
      isSelected
        ? "!bg-mustard !text-ink !font-medium"
        : isFocused
        ? "!bg-ink/5 dark:!bg-paper/5 !text-ink dark:!text-paper"
        : "!bg-paper-50 dark:!bg-ink-700 !text-ink/80 dark:!text-paper/80"
    }`,
  menu: () =>
    "!bg-paper-50 dark:!bg-ink-700 !border !border-ink/10 dark:!border-paper/10 !rounded-xl !shadow-lift !z-[9999] !overflow-hidden",
  menuPortal: () => "!z-[9999]",
  singleValue: () => "!text-ink dark:!text-paper",
  placeholder: () => "!text-ink/40 dark:!text-paper/40",
  dropdownIndicator: () => "!text-ink/40 dark:!text-paper/40",
  indicatorSeparator: () => "!bg-ink/10 dark:!bg-paper/10",
};

export function NewPlayGroundAndFolder(props) {
  const [selectedOption, setSelectedOption] = React.useState(
    languageOptions[0]
  );
  const [folderTitle, setFolderTitle] = React.useState("");
  const [cardTitle, setCardTitle] = React.useState("");

  const dispatch = useDispatch();
  const { toggle } = props;

  const createPlaygroundAndFolder = () => {
    if (folderTitle.trim().length && cardTitle.trim().length) {
      dispatch(
        addPlaygroundAndFolder({
          folderTitle: folderTitle.trim(),
          cardTitle: cardTitle.trim(),
          language: selectedOption.value,
        })
      );
      toggle();
    }
  };

  const isValid = folderTitle.trim().length > 0 && cardTitle.trim().length > 0;

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ink dark:bg-paper text-paper dark:text-ink rounded-xl flex items-center justify-center">
            <PlusIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink dark:text-paper">
              Create New Project
            </h2>
            <p className="text-sm text-ink/55 dark:text-paper/55">
              Set up a new folder and playground
            </p>
          </div>
        </div>
        <button
          onClick={toggle}
          className="p-2 text-ink/45 hover:text-ink dark:hover:text-paper hover:bg-ink/5 dark:hover:bg-paper/5 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Folder Name */}
        <div>
          <label className="block text-sm font-medium text-ink/80 dark:text-paper/80 mb-2">
            Folder Name
          </label>
          <input
            type="text"
            value={folderTitle}
            onChange={(e) => setFolderTitle(e.target.value)}
            placeholder="e.g., My Projects"
            className="w-full px-4 py-3 border border-ink/15 dark:border-paper/15 rounded-xl bg-paper dark:bg-ink-700 text-ink dark:text-paper placeholder-ink/35 dark:placeholder-paper/35 focus:border-ink dark:focus:border-paper focus:ring-2 focus:ring-mustard/40 focus:outline-none transition-colors"
          />
        </div>

        {/* Playground Name */}
        <div>
          <label className="block text-sm font-medium text-ink/80 dark:text-paper/80 mb-2">
            Playground Name
          </label>
          <input
            type="text"
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            placeholder="e.g., Hello World"
            className="w-full px-4 py-3 border border-ink/15 dark:border-paper/15 rounded-xl bg-paper dark:bg-ink-700 text-ink dark:text-paper placeholder-ink/35 dark:placeholder-paper/35 focus:border-ink dark:focus:border-paper focus:ring-2 focus:ring-mustard/40 focus:outline-none transition-colors"
          />
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-ink/80 dark:text-paper/80 mb-2">
            Programming Language
          </label>
          <Select
            value={selectedOption}
            onChange={setSelectedOption}
            options={languageOptions}
            classNames={selectClassNames}
            isSearchable={false}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            unstyled
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={toggle}
          className="flex-1 px-4 py-3 text-ink/65 dark:text-paper/65 bg-paper-200 dark:bg-ink-700 hover:bg-paper-300 dark:hover:bg-ink-600 rounded-xl font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={createPlaygroundAndFolder}
          disabled={!isValid}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            isValid
              ? "bg-mustard text-ink border border-mustard-500 shadow-press hover:bg-mustard-300 hover:shadow-lift"
              : "bg-paper-200 dark:bg-ink-700 text-ink/35 dark:text-paper/35 cursor-not-allowed"
          }`}
        >
          Create Project
        </button>
      </div>
    </div>
  );
}

export function NewPlayground(props) {
  const [selectedOption, setSelectedOption] = React.useState(
    languageOptions[0]
  );
  const [title, setTitle] = React.useState("");

  const { toggle } = props;
  const { folderId } = props.modal;
  const dispatch = useDispatch();

  const createPlayground = () => {
    if (title.trim().length) {
      dispatch(
        addPlayground({
          title: title.trim(),
          language: selectedOption.value,
          folderId,
        })
      );
      toggle();
    }
  };

  const isValid = title.trim().length > 0;

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mint-400 text-ink rounded-xl flex items-center justify-center">
            <CodeBracketIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink dark:text-paper">
              New Playground
            </h2>
            <p className="text-sm text-ink/55 dark:text-paper/55">
              Create a new coding playground
            </p>
          </div>
        </div>
        <button
          onClick={toggle}
          className="p-2 text-ink/45 hover:text-ink dark:hover:text-paper hover:bg-ink/5 dark:hover:bg-paper/5 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Playground Name */}
        <div>
          <label className="block text-sm font-medium text-ink/80 dark:text-paper/80 mb-2">
            Playground Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., API Client, Todo App"
            className="w-full px-4 py-3 border border-ink/15 dark:border-paper/15 rounded-xl bg-paper dark:bg-ink-700 text-ink dark:text-paper placeholder-ink/35 dark:placeholder-paper/35 focus:border-ink dark:focus:border-paper focus:ring-2 focus:ring-mustard/40 focus:outline-none transition-colors"
            autoFocus
          />
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-ink/80 dark:text-paper/80 mb-2">
            Programming Language
          </label>
          <Select
            value={selectedOption}
            onChange={setSelectedOption}
            options={languageOptions}
            classNames={selectClassNames}
            isSearchable={false}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            unstyled
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={toggle}
          className="flex-1 px-4 py-3 text-ink/65 dark:text-paper/65 bg-paper-200 dark:bg-ink-700 hover:bg-paper-300 dark:hover:bg-ink-600 rounded-xl font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={createPlayground}
          disabled={!isValid}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            isValid
              ? "bg-mustard text-ink border border-mustard-500 shadow-press hover:bg-mustard-300 hover:shadow-lift"
              : "bg-paper-200 dark:bg-ink-700 text-ink/35 dark:text-paper/35 cursor-not-allowed"
          }`}
        >
          Create Playground
        </button>
      </div>
    </div>
  );
}

export function NewFolder(props) {
  const { toggle } = props;
  const dispatch = useDispatch();
  const [title, setTitle] = React.useState("");

  const createFolder = () => {
    if (title.trim().length) {
      dispatch(addFolder({ title: title.trim(), playgrounds: {} }));
      toggle();
    }
  };

  const isValid = title.trim().length > 0;

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mustard text-ink rounded-xl flex items-center justify-center">
            <FolderIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink dark:text-paper">
              New Folder
            </h2>
            <p className="text-sm text-ink/55 dark:text-paper/55">
              Organize your playgrounds
            </p>
          </div>
        </div>
        <button
          onClick={toggle}
          className="p-2 text-ink/45 hover:text-ink dark:hover:text-paper hover:bg-ink/5 dark:hover:bg-paper/5 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink/80 dark:text-paper/80 mb-2">
            Folder Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Web Projects, Algorithms"
            className="w-full px-4 py-3 border border-ink/15 dark:border-paper/15 rounded-xl bg-paper dark:bg-ink-700 text-ink dark:text-paper placeholder-ink/35 dark:placeholder-paper/35 focus:border-ink dark:focus:border-paper focus:ring-2 focus:ring-mustard/40 focus:outline-none transition-colors"
            autoFocus
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={toggle}
          className="flex-1 px-4 py-3 text-ink/65 dark:text-paper/65 bg-paper-200 dark:bg-ink-700 hover:bg-paper-300 dark:hover:bg-ink-600 rounded-xl font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={createFolder}
          disabled={!isValid}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            isValid
              ? "bg-mustard text-ink border border-mustard-500 shadow-press hover:bg-mustard-300 hover:shadow-lift"
              : "bg-paper-200 dark:bg-ink-700 text-ink/35 dark:text-paper/35 cursor-not-allowed"
          }`}
        >
          Create Folder
        </button>
      </div>
    </div>
  );
}

export function EditTitle(props) {
  const { toggle } = props;
  let { type, title = "", playgroundId, folderId } = props.modal;

  const [currentTitle, setCurrentTitle] = React.useState(title);
  const dispatch = useDispatch();

  const updateTitle = () => {
    if (currentTitle.trim().length) {
      dispatch(
        editTitles({
          type,
          title: currentTitle.trim(),
          playgroundId,
          folderId,
        })
      );
      toggle();
    }
  };

  const isValid = currentTitle.trim().length > 0;
  const isFolder = type === "editFolder";
  const modalTitle = isFolder ? "Edit Folder" : "Edit Playground";
  const itemType = isFolder ? "folder" : "playground";

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isFolder
                ? "bg-mustard text-ink"
                : "bg-ink dark:bg-paper text-paper dark:text-ink"
            }`}
          >
            {isFolder ? (
              <FolderIcon className="w-5 h-5 text-white" />
            ) : (
              <PencilIcon className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink dark:text-paper">
              {modalTitle}
            </h2>
            <p className="text-sm text-ink/55 dark:text-paper/55">
              Rename your {itemType}
            </p>
          </div>
        </div>
        <button
          onClick={toggle}
          className="p-2 text-ink/45 hover:text-ink dark:hover:text-paper hover:bg-ink/5 dark:hover:bg-paper/5 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink/80 dark:text-paper/80 mb-2">
            {isFolder ? "Folder" : "Playground"} Name
          </label>
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            className={`w-full px-4 py-3 border border-ink/15 dark:border-paper/15 rounded-xl bg-paper dark:bg-ink-700 text-ink dark:text-paper placeholder-ink/35 dark:placeholder-paper/35 focus:ring-2 focus:ring-mustard/40 focus:outline-none transition-colors ${
              isFolder ? "focus:border-mustard-500" : "focus:border-ink dark:focus:border-paper"
            } focus:ring-0`}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && isValid && updateTitle()}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={toggle}
          className="flex-1 px-4 py-3 text-ink/65 dark:text-paper/65 bg-paper-200 dark:bg-ink-700 hover:bg-paper-300 dark:hover:bg-ink-600 rounded-xl font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={updateTitle}
          disabled={!isValid}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            isValid
              ? isFolder
                ? "bg-mustard text-ink border border-mustard-500 shadow-press hover:bg-mustard-300 hover:shadow-lift"
                : "bg-ink text-paper border border-ink shadow-soft hover:bg-ink-700 hover:shadow-lift dark:bg-paper dark:text-ink dark:border-paper dark:hover:bg-paper-200"
              : "bg-paper-200 dark:bg-ink-700 text-ink/35 dark:text-paper/35 cursor-not-allowed"
          }`}
        >
          Update {isFolder ? "Folder" : "Playground"}
        </button>
      </div>
    </div>
  );
}

export function Load(props) {
  const { type } = props;

  return (
    <div className="p-8 max-w-sm mx-auto">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Loading Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-ink/15 dark:border-paper/15 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-mustard rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-ink dark:text-paper mb-1">
            {type}...
          </h3>
          <p className="text-sm text-ink/55 dark:text-paper/55">
            Please wait a moment
          </p>
        </div>
      </div>
    </div>
  );
}
