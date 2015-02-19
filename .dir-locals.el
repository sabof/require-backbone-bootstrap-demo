;;; Directory Local Variables
;;; For more information see (info "(emacs) Directory Variables")

((js2-mode
  ( es-test-source-dir
    . (when (string-match-p "backend" (buffer-file-name))
        (concat (funcall pe/project-root-function) "backend/")))
  ( es-test-test-dir
    . (when (string-match-p "backend" (buffer-file-name))
        (concat (funcall pe/project-root-function) "backend-tests/")))))
