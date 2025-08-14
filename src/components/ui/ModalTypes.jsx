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
    `!bg-transparent !border-2 !border-slate-200 dark:!border-slate-700 !rounded-xl !px-4 !py-2 !min-h-[48px] !shadow-none ${
      isFocused
        ? "!border-blue-500 !ring-2 !ring-blue-500/10"
        : "hover:!border-slate-400 dark:hover:!border-slate-600"
    }`,
  option: ({ isSelected, isFocused }) =>
    `!py-3 !px-4 !cursor-pointer ${
      isSelected
        ? "!bg-blue-500 !text-white"
        : isFocused
        ? "!bg-slate-100 dark:!bg-slate-700 !text-slate-900 dark:!text-slate-100"
        : "!bg-white dark:!bg-slate-800 !text-slate-900 dark:!text-slate-100"
    }`,
  menu: () =>
    "!bg-white dark:!bg-slate-800 !border !border-slate-200 dark:!border-slate-700 !rounded-xl !shadow-lg !z-[9999]",
  menuPortal: () => "!z-[9999]",
  singleValue: () => "!text-slate-900 dark:!text-slate-100",
  placeholder: () => "!text-slate-400 dark:!text-slate-500",
  dropdownIndicator: () => "!text-slate-400 dark:!text-slate-500",
  indicatorSeparator: () => "!bg-slate-200 dark:!bg-slate-700",
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
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <PlusIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Create New Project
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Set up a new folder and playground
            </p>
          </div>
        </div>
        <button
          onClick={toggle}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Folder Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Folder Name
          </label>
          <input
            type="text"
            value={folderTitle}
            onChange={(e) => setFolderTitle(e.target.value)}
            placeholder="e.g., My Projects"
            className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-0 transition-colors"
          />
        </div>

        {/* Playground Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Playground Name
          </label>
          <input
            type="text"
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            placeholder="e.g., Hello World"
            className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-0 transition-colors"
          />
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
          className="flex-1 px-4 py-3 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={createPlaygroundAndFolder}
          disabled={!isValid}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            isValid
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
              : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
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
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <CodeBracketIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              New Playground
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Create a new coding playground
            </p>
          </div>
        </div>
        <button
          onClick={toggle}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Playground Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Playground Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., API Client, Todo App"
            className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-green-500 focus:ring-0 transition-colors"
            autoFocus
          />
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
          className="flex-1 px-4 py-3 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={createPlayground}
          disabled={!isValid}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            isValid
              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl"
              : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
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
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <FolderIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              New Folder
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Organize your playgrounds
            </p>
          </div>
        </div>
        <button
          onClick={toggle}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Folder Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Web Projects, Algorithms"
            className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-amber-500 focus:ring-0 transition-colors"
            autoFocus
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={toggle}
          className="flex-1 px-4 py-3 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={createFolder}
          disabled={!isValid}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            isValid
              ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl"
              : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
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
                ? "bg-gradient-to-br from-amber-500 to-orange-600"
                : "bg-gradient-to-br from-blue-500 to-indigo-600"
            }`}
          >
            {isFolder ? (
              <FolderIcon className="w-5 h-5 text-white" />
            ) : (
              <PencilIcon className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {modalTitle}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Rename your {itemType}
            </p>
          </div>
        </div>
        <button
          onClick={toggle}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {isFolder ? "Folder" : "Playground"} Name
          </label>
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            className={`w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors ${
              isFolder ? "focus:border-amber-500" : "focus:border-blue-500"
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
          className="flex-1 px-4 py-3 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={updateTitle}
          disabled={!isValid}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            isValid
              ? isFolder
                ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
              : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
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
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
            {type}...
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please wait a moment
          </p>
        </div>
      </div>
    </div>
  );
}
